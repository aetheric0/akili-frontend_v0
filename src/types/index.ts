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
    isPaid: boolean;
    sessions: SessionInfo[];
    activeSessionId: string | null;
    chatHistories: Record<string, ChatMessage[]>;   
    guest_token: string | null; // Added to store the user's token

    // === Gamification State ===
    xp: number;
    coins: number;
    streak_days: number;

    // === B. UI / Loading State =========================================
    isLoading: boolean;
    _hasHydrated: boolean; // Replaces isHydrating for internal use
    uploadError: string | null;
    chatError: string | null;

    // === D. Actions / State Mutators =========================================
     initializeGuestToken: () => void;
    setHasHydrated: (hydrated: boolean) => void;
    setLoading: (loading: boolean) => void;
    setGuestToken: (token: string) => void; // Action to set the token
    grantAccess: () => void;
    setUploadError: (error: string | null) => void;
    setChatError: (error: string | null) => void;
    fetchSessions: () => Promise<void>;
    setActiveSession: (sessionId: string | null) => void;
    startNewSession: (sessionInfo: SessionInfo, initialMessage: ChatMessage) => void;
    clearSession: (sessionId: string) => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    sendChatMessage: (message: string) => Promise<void>;

    updateXp: (newXp: number) => void;
}
// --- API CONSTANTS ---
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/';
export const API_BASE_URL = 'http://localhost:8000';
export const DOCUMENT_UPLOAD_ENDPOINT = `${API_BASE_URL}/upload/document`;
export const CHAT_ENDPOINT = `${API_BASE_URL}/upload/chat`;
export const HISTORY_ENDPOINT = `${API_BASE_URL}/sessions`;
export const AKILI_STATE_KEY = 'akili-ai-session-state'; 
