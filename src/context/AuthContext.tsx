import { create } from "zustand";
import { AKILI_STATE_KEY, type AppState, type ChatMessage, type SessionInfo } from "../types/index";
import { sendChatMessageApi } from "../api/studyPackApi";
import { persist } from "zustand/middleware";
import sessionsApi from "../api/sessionApi"
// --- 1. STATE MANAGEMENT (Zustand with Persistence) -----------------------


export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      // -- New State Structure ---
      sessions: [],
      activeSessionId: null,
      chatHistories: {},

      // --- Exising State ---
      isPaid: false,
      isLoading: false,
      isHydrating: false,
      uploadError: null,
      chatError: null,
      _hasHydrated: false, // Internal use only

      // --- Updated Acations
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      setLoading: (loading) => set({ isLoading: loading }),
      setUploadError: (error) => set({ uploadError: error }),
      setChatError: (error) => set({ chatError: error }),
      grantAccess: () => {
        set({ isPaid: true });
      },
      fetchSessions: async () => {
        // TODO: Call your new GET /sessions endpoint here
        const fetchedSessions = await sessionsApi();
        set({ sessions: fetchedSessions });
      },
      setActiveSession: (sessionId: string | null) => {
        set({ activeSessionId: sessionId});
      },
      startNewSession: (sessionInfo: SessionInfo, initialMessage: ChatMessage) => {
        set((state) => ({
          // State update happens here
          sessions: [sessionInfo, ...state.sessions],
          activeSessionId: sessionInfo.id,
          chatHistories: {
            ...state.chatHistories,
            [sessionInfo.id]: [initialMessage],
          },
          uploadError: null,
          chatError: null,
          isLoading: false,
          isHydrating: false,
        }));
    },
        
      addMessage: (message: ChatMessage) => {
        const activeSessionId = get().activeSessionId;
        if (!activeSessionId)  return;
        set((state) => ({
          chatHistories: {
            ...state.chatHistories,
            [activeSessionId]: [...(state.chatHistories[activeSessionId] || []), message],
          },
        }));
      },

      // TODO: CHECK THIS CLEARSESSION LOGIC LATER
      clearSession: () => {
        set({
          uploadError: null,
          chatError: null,
          isHydrating: false,
        });
        // Remove from local storage immediately when session is cleared
        localStorage.removeItem(AKILI_STATE_KEY);
      },

      sendChatMessage: async (message) => {
        const state = get();
        if (!state.activeSessionId) {
          get().setChatError("No active session. Please upload a document first.");
          return;
        }

        const currentSessionId = state.activeSessionId;
        get().setLoading(true);
        get().addMessage({ role: "user", text: message });
        get().setChatError(null);

        try {
          const aiResponseText = await sendChatMessageApi(currentSessionId, message);
          get().addMessage({ role: "model", text: aiResponseText });
        } catch (error) {
          const errorMessage = (error as Error).message;
          get().setChatError("Chat Failed: " + errorMessage);
          get().addMessage({ role: "model", text: `[Error] ${errorMessage}` });   // COMMENT THIS OUT IN PRODUCTION
        } finally {
          get().setLoading(false);
        }
      },
    }),
    {
      name: "akili-chat-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        chatHistories: state.chatHistories,
        isPaid: state.isPaid,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
