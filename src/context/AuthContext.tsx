import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from 'uuid';
import type { AppState, ChatMessage, SessionInfo } from "../types/index";
import { sendChatMessageApi } from "../api/studyPackApi";
import { getSessionsApi, deleteSessionApi } from "../api/sessionApi";

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      // --- CORE STATE ---
      guest_token: null,
      sessions: [],
      activeSessionId: null,
      chatHistories: {},
      isPaid: false,

      // --- GAMIFICATION STATE ---
      xp: 0,
      coins: 0,
      streak_days: 0,

      // --- UI & LOADING STATE ---
      isLoading: false,
      uploadError: null,
      chatError: null,
      _hasHydrated: false,

      // --- ACTIONS ---
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      setLoading: (loading) => set({ isLoading: loading }),
      setUploadError: (error) => set({ uploadError: error }),
      setChatError: (error) => set({ chatError: error }),
      grantAccess: () => set({ isPaid: true }),

      // ✅ FIX: Correctly implemented setGuestToken
      setGuestToken: (token: string) => set({ guest_token: token }),

      // ✅ FIX: Added the primary logic for ensuring a token exists on app start
      initializeGuestToken: () => {
        if (!get().guest_token) {
          set({ guest_token: uuidv4() });
        }
      },

      fetchSessions: async () => {
        set({ isLoading: true });
        try {
          const fetchedSessions = await getSessionsApi();
          set({ sessions: fetchedSessions || [] });
        } catch (error) {
          console.error("Failed to fetch sessions:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      setActiveSession: (sessionId: string | null) => {
        set({ activeSessionId: sessionId, chatError: null });
      },

      startNewSession: (sessionInfo: SessionInfo, initialMessage: ChatMessage) => {
        set((state) => ({
          sessions: [sessionInfo, ...state.sessions],
          activeSessionId: sessionInfo.id,
          chatHistories: {
            ...state.chatHistories,
            [sessionInfo.id]: [initialMessage],
          },
        }));
      },

      clearSession: async (sessionId: string) => {
        try {
          await deleteSessionApi(sessionId);
          set((state) => {
            const newChatHistories = { ...state.chatHistories };
            delete newChatHistories[sessionId];
            return {
              sessions: state.sessions.filter(s => s.id !== sessionId),
              activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
              chatHistories: newChatHistories,
            };
          });
        } catch (error) {
          console.error("Failed to delete session:", error);
        }
      },

      addMessage: (message: ChatMessage) => {
        const activeSessionId = get().activeSessionId;
        if (!activeSessionId) return;
        set((state) => ({
          chatHistories: {
            ...state.chatHistories,
            [activeSessionId]: [...(state.chatHistories[activeSessionId] || []), message],
          },
        }));
      },

      sendChatMessage: async (message) => {
        const activeSessionId = get().activeSessionId;
        if (!activeSessionId) {
          set({ chatError: "No active session." });
          return;
        }
        set({ isLoading: true, chatError: null });
        get().addMessage({ role: "user", text: message });
        try {
          const aiResponseText = await sendChatMessageApi(activeSessionId, message);
          get().addMessage({ role: "model", text: aiResponseText });
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ chatError: `Chat Failed: ${errorMessage}` });
        } finally {
          set({ isLoading: false });
        }
      },
      updateXp: (newXp: number) => set({ xp: newXp }),
    }),
    {
      name: "akili-chat-storage",
      partialize: (state) => ({
        // ✅ FIX: Ensure the guest_token is persisted
        guest_token: state.guest_token,
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        chatHistories: state.chatHistories,
        isPaid: state.isPaid,
        xp: state.xp,
        coins: state.coins,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);