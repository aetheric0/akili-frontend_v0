import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from 'uuid';
import type { AppState, ChatMessage, SessionInfo } from "../types/index";
import { sendChatMessageApi } from "../api/studyPackApi";
import { getSessionsApi, deleteSessionApi, getSessionDetailsApi, createNewChatSessionApi } from "../api/sessionApi";
import { supabase } from "../lib/supabaseClient";
import type { Session, User } from '@supabase/supabase-js';
import { MERGE_GUEST_SESSION_ENDPOINT } from "../types";

const initialState = {
  user: null,
  session: null,
  guest_token: null,
  pendingMerge: false,
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
  mode: 'chat' as 'chat' | 'study',
};

const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "dark";
document.documentElement.classList.toggle("dark", savedTheme === "dark");

export const useAppState = create<AppState>()(
  persist(
    (set, get) => ({
      // --- CORE STATE ---
      ...initialState,

      // --- ACTIONS ---
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      setAuth: (user: User | null, session: Session | null) => set({ user, session }),
      setPendingMerge: (status) => set({ pendingMerge: status }),
      setLoading: (loading) => set({ isLoading: loading }),
      setUploadError: (error) => set({ uploadError: error }),
      setChatError: (error) => set({ chatError: error }),
      setMode: (mode: 'chat' | 'study') => set({ mode }),
      grantAccess: () => set({ isPaid: true }),
      setAuthSession: (user: User | null, session: Session | null) => set({ user, session }),
      setAuthReady: (isReady: boolean) => set({ isAuthReady: isReady }),
      initializeAuth: () => {
        // This is the main startup function. It checks for a real user first.
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session) {
            // User is LOGGED IN
            set({ user: session.user, session });
            await get().fetchSessions();
          } else {
            // User is a GUEST
            let token = localStorage.getItem("guestToken");
            if (!token) {
                token = `guest_${uuidv4()}`;
                localStorage.setItem("guestToken", token);
                localStorage.setItem("isGuestSessionActive", "true");
            }
            set({ guest_token: token });
          }
          // 2. Mark auth as ready AFTER the check is complete
          set({ isAuthReady: true });
        });

        // 3. Set up the listener for FUTURE changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          set({ user: session?.user ?? null, session });

          if (event === 'SIGNED_IN' && session) {
            const guestToken = get().guest_token;
            if (guestToken && localStorage.getItem("isGuestSessionActive") === "true") {
              set({ pendingMerge: true }); // Trigger the merge modal
            } else {
              await get().fetchSessions(); // No merge, just fetch data
            }
          }
        });

        return () => subscription.unsubscribe();
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

      mergeGuestData: async () => {
        const { guest_token, getToken, clearGuestState, fetchSessions } = get();
        if (!guest_token) {
          set({ pendingMerge: false });
          return;
        }

        try {
          const token = await getToken();
          if (!token) throw new Error("User is not authenticated.");

          const response = await fetch(MERGE_GUEST_SESSION_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ guest_token: guest_token }),
          });

          if (!response.ok) throw new Error("Backend merge failed");

          console.log("Guest data successfully merged.");
          clearGuestState(); // Clear the old guest ID
          set({ pendingMerge: false });
          await fetchSessions(); // Refresh the session list with the merged data
        } catch (error) {
          console.error("Failed to merge guest data:", error);
          set({ pendingMerge: false });
        }
      },

      discardGuestData: () => {
        get().clearGuestState();
        set({ pendingMerge: false });
        console.log("Guest data discarded.");
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

        const session = get().sessions.find(s => s.id === sessionId);
        if (!session) {
          console.error("Attempted to activate a session that does not exist:", sessionId);
          return;
        }

        // Defensively determine the mode to ensure it's always a valid value
        const newMode = session.mode === 'study' ? 'study' : 'chat';
        console.log(newMode);

        set({ 
          activeSessionId: sessionId, 
          mode: newMode, // <-- This is now robust
          isLoading: true, 
          chatError: null 
        });
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

      createNewChatSession: async () => {
        set({ isLoading: true });
        try {
          const newSession = await createNewChatSessionApi();
          if (newSession) {
            set(state => ({
              sessions: [newSession, ...state.sessions],
              activeSessionId: newSession.id,
              mode: 'chat', // Switch to chat mode automatically
              chatHistories: {
                ...state.chatHistories,
                [newSession.id]: [] // Start with an empty history
              }
            }));
          }
        } catch (error) {
          console.error("Failed to create new chat session:", error);
          set({ chatError: "Could not start a new chat." });
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

        const activeSession = get().sessions.find(s => s.id === activeSessionId);
        const isFirstChatMessage = activeSession?.document_name === "New Conversation" && get().chatHistories[activeSessionId]?.length === 0;

        set({ isLoading: true, chatError: null });
        get().addMessage({ role: "user", text: message });
        try {
          const aiResponseText = await sendChatMessageApi(activeSessionId, message);
          get().addMessage({ role: "model", text: aiResponseText });

          if (isFirstChatMessage) {
            console.log("First message sent in a new chat. Refetching sessions to get the new title...")
            await get().fetchSessions();
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          set({ chatError: `Chat Failed: ${errorMessage}` });
        } finally {
          set({ isLoading: false });
        }
      },
      theme: savedTheme,
      toggleTheme: () => set((state) => {
        const newTheme: "light" | "dark" = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        return { theme: newTheme };
      }),
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
        mode: state.mode,
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