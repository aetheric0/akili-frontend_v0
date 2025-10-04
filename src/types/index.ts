// -- 0. TYPE DEFINITIONS -------------------------------------------------
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface AppState {
    isPaid: boolean;
    sessionId: string | null;
    chatHistory: ChatMessage[];
    isLoading: boolean;
    isHydrating: boolean;
    uploadError: string | null;
    chatError: string | null;
    
    setLoading: (loading: boolean) => void;
    setUploadError: (error: string | null) => void;
    setChatError: (error: string | null) => void;
    startNewSession: (id: string, initialMessage: ChatMessage) => void;
    addMessage: (message: ChatMessage) => void;
    clearSession: () => void;
    grantAccess: () => void;
    sendChatMessage: (message: string) => Promise<void>;
}

// --- API CONSTANTS ---
export const API_BASE_URL = 'https://akili-wcqt.onrender.com';
export const DOCUMENT_UPLOAD_ENDPOINT = `${API_BASE_URL}/upload/document`;
export const CHAT_ENDPOINT = `${API_BASE_URL}/upload/chat`;
export const HISTORY_ENDPOINT = `${API_BASE_URL}/session/history`;
export const AKILI_STATE_KEY = 'akili-ai-session-state'; 