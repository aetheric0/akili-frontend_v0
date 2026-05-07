import type { User, Session } from "@supabase/supabase-js";

// -- 0. TYPE DEFINITIONS -------------------------------------------------
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface SessionInfo {
    id: string;
    document_name: string;
    createdAt?: string;
    [key: string]: any;
}

export type Theme = "light" | "dark";


// -- 1. GLOBAL APP STATE ----------------------------------------
export interface AppState {
    //  === Core State (Persistent) =========================================
    isPaid: boolean;
    sessions: SessionInfo[];
    activeSessionId: string | null;
    chatHistories: Record<string, ChatMessage[]>;   
    guest_token: string | null; // Added to store the user's token
    user: User | null;
    isAuthReady: boolean;
    session: Session | null;
    pendingMerge: boolean; 
    mode: 'chat' | 'study';
    theme: Theme;
  

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
    setAuth: (user: User | null, session: Session | null) => void;
    setAuthReady: (isReady: boolean) => void;
    getToken: () => Promise<string | null>;
    setHasHydrated: (hydrated: boolean) => void;
    setLoading: (loading: boolean) => void;
    initializeGuestToken: () => void;
    initializeAuth: () => () => void;
    grantAccess: () => void;
    setMode: (mode: 'chat' | 'study') => void;
    setUploadError: (error: string | null) => void;
    setChatError: (error: string | null) => void;
    fetchSessions: () => Promise<void>;
    setPendingMerge: (status: boolean) => void;
    mergeGuestData: () => Promise<void>;
    discardGuestData: () => void;
    setAuthSession: (user: User | null, session: Session | null) => void;
    setActiveSession: (sessionId: string | null) => Promise<void>;
    createNewChatSession: () => Promise<void>;
    startNewSession: (sessionInfo: SessionInfo, initialMessage: ChatMessage) => void;
    clearSession: (sessionId: string) => Promise<void>;
    addMessage: (message: ChatMessage) => void;
    sendChatMessage: (message: string) => Promise<void>;
    toggleTheme: () => void;

    updateXp: (newXp: number) => void;
    completeFocusSession: () => void;
    clearGuestState: () => void;
    signOut: () => void;
}
// --- API CONSTANTS ---
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/';
// export const API_BASE_URL = 'http://localhost:8000';
export const DOCUMENT_UPLOAD_ENDPOINT = `${API_BASE_URL}/upload/document`;
export const CHAT_ENDPOINT = `${API_BASE_URL}/upload/chat`;
export const HISTORY_ENDPOINT = `${API_BASE_URL}/sessions`;
export const AKILI_STATE_KEY = 'akili-ai-session-state'; 
export const MERGE_GUEST_SESSION_ENDPOINT = `${API_BASE_URL}/auth/merge-guest-session`