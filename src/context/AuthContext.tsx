import { create } from "zustand";
import { AKILI_STATE_KEY, type AppState, } from "../types/index";
import { sendChatMessageApi } from "../api/studyPackApi";
import getInitialSessionState from "../utils/getIninitalSessionState";

// --- 1. STATE MANAGEMENT (Zustand with Persistence) -----------------------

export const initialSessionId = getInitialSessionState();

export const useAppState = create<AppState>((set, get) => ({
    isPaid: false,
    sessionId: initialSessionId, 
    chatHistory: [],
    isLoading: false,
    isHydrating: false,
    uploadError: null,
    chatError: null,
    
    setLoading: (loading) => set({ isLoading: loading }),
    setUploadError: (error) => set({ uploadError: error }),
    setChatError: (error) => set({ chatError: error }),

    grantAccess: () => {
        set({ isPaid: true });
    },

    startNewSession: (id, initialMessage) => set({ 
        sessionId: id, // State update happens here
        chatHistory: [initialMessage],
        uploadError: null,
        chatError: null,
        isLoading: false,
        isHydrating: false,
    }),

    addMessage: (message) => set((state) => ({ 
        chatHistory: [...state.chatHistory, message] 
    })),

    clearSession: () => {
        set({ 
            sessionId: null, 
            chatHistory: [], 
            uploadError: null,
            chatError: null,
            isHydrating: false,
        });
        // Remove from local storage immediately when session is cleared
        localStorage.removeItem(AKILI_STATE_KEY); 
    },

    sendChatMessage: async (message) => {
        const state = get();
        if (!state.sessionId) {
            get().setChatError("No active session. Please upload a document first.");
            return;
        }
        
        get().setLoading(true);
        get().addMessage({ role: 'user', text: message });
        get().setChatError(null); 

        try {
            const aiResponseText = await sendChatMessageApi(state.sessionId, message);
            get().addMessage({ role: 'model', text: aiResponseText });
        } catch (error) {
            const errorMessage = (error as Error).message;
            get().setChatError("Chat Failed: " + errorMessage);
            get().addMessage({ role: 'model', text: `[Error] ${errorMessage}` });
        } finally {
            get().setLoading(false);
        }
    }
}));