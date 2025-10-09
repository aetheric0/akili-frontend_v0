// -- 0. TYPE DEFINITIONS -------------------------------------------------
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface SessionInfo {
    id: string;
    title: string;
    createdAt?: string;
    [key: string]: any;
}


// -- 1. GLOBAL APP STATE ----------------------------------------
export interface AppState {
    //  === Core State (Persistent) =========================================
    isPaid: boolean;                                // User access status
    sessions: SessionInfo[];                        // All chat/document sessions
    activeSessionId: string | null;                 // Currenctly active session
    chatHistories: Record<string, ChatMessage[]>;   // Per-session chat storage

    // === B. UI / Loading State =========================================
    isLoading: boolean;                             // Indicates active API call or chat
    isHydrating: boolean;                           // True during persistence rehydration
    uploadError: string | null;                     // Error from file upload
    chatError: string | null;                       // Error during chat message

    // === C. Internal State (Non-Persistent) =========================================
    _hasHydrated: boolean;                          // Used by Zustand after rehydration

    // === D. Actions / State Mutators =========================================
    // --- Hydration & Status ---
    setHasHydrated: (hydrated: boolean) => void;
    setLoading: (loading: boolean) => void;
    grantAccess: () => void;

    // --- Error Handling
    setUploadError: (error: string | null) => void;
    setChatError: (error: string | null) => void;

    // --- Session Management ---
    fetchSessions: () => Promise<void>;
    setActiveSession: (sessionId: string | null) => void;
    startNewSession: (sessionInfo: SessionInfo, initialMessage: ChatMessage) => void;
    clearSession: () => void;

    // --- Chat Management ---
    addMessage: (message: ChatMessage) => void;
    sendChatMessage: (message: string) => Promise<void>;
}

// --- API CONSTANTS ---
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/';
// export const API_BASE_URL = 'http://localhost:8000';
export const DOCUMENT_UPLOAD_ENDPOINT = `${API_BASE_URL}/upload/document`;
export const CHAT_ENDPOINT = `${API_BASE_URL}/upload/chat`;
export const HISTORY_ENDPOINT = `${API_BASE_URL}/session/history`;
export const AKILI_STATE_KEY = 'akili-ai-session-state'; 