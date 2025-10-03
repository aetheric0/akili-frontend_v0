import { create } from "zustand";
import type { AppState } from "../types/index";
import { sendChatMessageApi } from "../api/studyPackApi";

// --- 1. STATE MANAGEMENT --- (Zustand) --------------------------------

/**
 * Global state for managing the application's overall status,
 * including payment, active session, and chat history.
 */

export const useAppState = create<AppState>((set, get) => ({
    isPaid: false,

    // Chat State
    sessionId: localStorage.getItem('chatSessionId') || null,
    chatHistory: [],
    isLoading: false,
    uploadError: null,
    chatError: null,

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),
    setUploadError: (error) => set({ uploadError: error }),
    setChatError: (error) => set({ chatError: error }),

    startNewSession: (id, initialMessage) => { 
        localStorage.setItem('chatSessionId', id);
        set({
            sessionId: id,
            chatHistory: [{...initialMessage, role: 'model', isInitial: true}],
            uploadError: null,
            chatError: null,
        }); 
    },
    addMessage: (message) => set((state) => ({
        chatHistory: [...state.chatHistory, message]
    })),
    clearSession: () => {
        localStorage.removeItem('chatSessionId');
        set({ sessionId: null, chatHistory: [], chatError: null, uploadError: null });
    },

    // --- State Action leveraging the API Service (simulating import) ---
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
            // CALLING THE API FUNCTION DEFINED ABOVE
            const aiResponseText = await sendChatMessageApi(state.sessionId, message);
            
            get().addMessage({ role: 'model', text: aiResponseText });

        } catch (error) {
            // Catch the simplified error thrown by the API function
            const errorMessage = (error as Error).message;
            
            get().setChatError("Chat Failed: " + errorMessage);
            get().addMessage({ role: 'model', text: `[Error] ${errorMessage}` });
        } finally {
            get().setLoading(false);
        }
    }
}));


