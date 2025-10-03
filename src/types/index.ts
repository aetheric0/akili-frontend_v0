// -- 0. TYPE DEFINITIONS -------------------------------------------------
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    isInitial?: boolean;
}

type InitialMessagePayload = Omit<ChatMessage, 'role'>;

export interface AppState {
    isPaid: boolean;

    // Chat State
    sessionId: string | null;
    chatHistory: ChatMessage[];
    isLoading: boolean;
    uploadError: string | null;
    chatError: string | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setUploadError: (error: string | null) => void;
    setChatError: (error: string | null) => void;

    startNewSession: (id: string, initialMessage: InitialMessagePayload) => void;
    addMessage: (message: ChatMessage) => void;
    clearSession: () => void;

    sendChatMessage: (message: string) => Promise<void>;
}