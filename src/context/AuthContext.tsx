import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from 'uuid';
import type { AppState, ChatMessage, SessionInfo } from "../types/index";
import { sendChatMessageApi } from "../api/studyPackApi";
import { getSessionsApi, deleteSessionApi, getSessionDetailsApi } from "../api/sessionApi";
import { supabase } from "../lib/supabaseClient";
import type { Session, User } from '@supabase/supabase-js';

const initialState = {
  user: null,
  session: null,
  guest_token: null,
  sessions: [],
  isAuthReady: false,
  activeSessionId: null,
  chatHistories: {},
  isPaid: false,
  xp: 0,
  coins: 0,
  streak_days: 0,
  isLoading: false,
  uploadError: null,
  chatError: null,
  sessionsCreated: 0, // Assuming you added this for the free trial
  _hasHydrated: false,
};

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      // --- CORE STATE ---
      ...initialState,

      // --- ACTIONS ---
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      setAuth: (user: User | null, session: Session | null) => set({ user, session }),
      setLoading: (loading) => set({ isLoading: loading }),
      setUploadError: (error) => set({ uploadError: error }),
      setChatError: (error) => set({ chatError: error }),
      grantAccess: () => set({ isPaid: true }),
      setAuthSession: (user: User | null, session: Session | null) => set({ user, session }),
      setAuthReady: (isReady: boolean) => set({ isAuthReady: isReady }),
      initializeAuth: () => {
        // This is the main startup function. It checks for a real user first.
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            console.log("Existing Supabase session found. Fetching user data.");
            set({ user: session.user, session });
            get().fetchSessions();
          } else {
            console.log("No active user session. Initializing as guest.");
            let token = localStorage.getItem("guestToken");
            if (!token) {
                token = `guest_${uuidv4()}`;
                localStorage.setItem("guestToken", token);
                localStorage.setItem("isGuestSessionActive", "true");
            }
            set({ guest_token: token });
          }
        });

        // This listener handles all future auth changes (SIGN_IN, SIGN_OUT)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          set({ user: session?.user ?? null, session });

          if (event === 'SIGNED_IN' && session) {
            console.log("User has signed in. Checking for guest data to merge...");
            const guestToken = get().guest_token;

            if (guestToken && localStorage.getItem("isGuestSessionActive") === "true") {
              // The merge logic will be triggered by a component, not here.
            }
            
            console.log("Fetching user sessions from backend...");
            await get().fetchSessions();
          }
        });

        return () => subscription.unsubscribe();
      },
      // setAuthSession: (user: User | null, session: Session | null) => {
      //   set({user, session});
      // },

      // ✅ FIX: Added the primary logic for ensuring a token exists on app start
      initializeGuestToken: () => {
        const { user } = get();

        if (user) return;
        
        let token = localStorage.getItem("guestToken");
        if (!token) {
            token = `guest_${uuidv4()}`; // Adds the "guest_" prefix
            localStorage.setItem("guestToken", token);
            // This flag tells our AuthHandler to perform a merge later
            localStorage.setItem("isGuestSessionActive", "true");
        }
        set({ guest_token: token });
      },
      getToken: async () => {
        const { session, guest_token } = get();
        // If the current token is expired, Supabase's getSession will refresh it
        if (session && session.expires_at && (session.expires_at * 1000) < Date.now() + 60000) { // check if expiring in next minute
          console.log("Supabase token is expiring or has expired, refreshing...");
          const { data } = await supabase.auth.refreshSession();
          if (data.session) {
            set({ session: data.session, user: data.user });
            return data.session.access_token;
          }
        }
        
        // Return the current session token or the guest token
        return session?.access_token || guest_token;
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

      setActiveSession: async (sessionId: string | null) => {
        if (!sessionId) {
          set({ activeSessionId: null });
          return;
        }
        
        set({ activeSessionId: sessionId, isLoading: true, chatError: null });
        
        try {
          // Check if we already have the history cached in our state
          if (!get().chatHistories[sessionId]) {
            console.log(`History for session ${sessionId} not found. Fetching from API...`);
            const { history } = await getSessionDetailsApi(sessionId);
            
            // Add the fetched history to our state
            set((state) => ({
              chatHistories: {
                ...state.chatHistories,
                [sessionId]: history,
              },
            }));
          }
        } catch (error) {
          console.error("Failed to fetch session details:", error);
          set({ chatError: "Failed to load chat history." });
        } finally {
          set({ isLoading: false });
        }
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

      completeFocusSession: () => set((state) => ({
        xp: state.xp + 50, // Award 50 XP
        coins: state.coins + 5, // Award 10 Coins
        // Here you could also add logic for notifications, etc.
      })),

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
       clearGuestState: () => {
        set({ guest_token: null });
        localStorage.removeItem("guestToken");
        localStorage.removeItem("isGuestSessionActive");
      },
      signOut: async () => {
        await supabase.auth.signOut();
        // Reset the Zustand store back to its initial empty state
        set(initialState);
        get().clearGuestState();
        localStorage.removeItem("isGuestSessionActive");
        localStorage.removeItem("guestToken");
        localStorage.removeItem("guest_token");
        localStorage.removeItem("akili-chat-storage");
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