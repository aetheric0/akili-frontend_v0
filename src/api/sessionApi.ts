import axios from "axios";
import type { ChatMessage, SessionInfo } from '../types/index';
//import { getOrCreateGuestToken } from "../utils/guestToken";
import { HISTORY_ENDPOINT } from "../types/index";
//import { supabase } from "../lib/supabaseClient";
import { useAppState } from "../context/AuthContext";

const getAuthHeader = async () => {
    // const { data: { session } } = await supabase.auth.getSession();
    // const guestToken = getOrCreateGuestToken();
    // const token = session?.access_token || guestToken;

    const token = await useAppState.getState().getToken();

    if (!token) {
        console.warn("No authentication token found for API request.")
        return {};
    }
    return {"Authorization": `Bearer ${token}`}
}

export const getSessionsApi = async (): Promise<SessionInfo[]> => {
    try {
        const headers = await getAuthHeader();
        if (!headers.Authorization) return [];
        const response = await axios.get(HISTORY_ENDPOINT, {headers});
        return response.data as SessionInfo[];
    } catch (error) {
        console.error("Failed to fetch sessions:", error);
        return [];
    }
}

export const getSessionDetailsApi = async (sessionId: string): Promise<{ history: ChatMessage[] }> => {
    const headers = await getAuthHeader();
    if (!headers.Authorization) throw new Error("User not authenticated.");

    const response = await axios.get(`${HISTORY_ENDPOINT}/${sessionId}`, { headers });
    // The history is nested inside the response data
    return { history: response.data.history || [] };
};

export const createNewChatSessionApi = async (): Promise<SessionInfo | null> => {
    try {
        const headers = await getAuthHeader();
        if (!headers.Authorization) return null;
        // Call the new backend endpoint
        const response = await axios.post(`${HISTORY_ENDPOINT}/new-chat`, {}, { headers });
        return response.data;
    } catch (error) {
        console.error("Failed to create new chat session:", error);
        return null;
    }
};

export const deleteSessionApi = async (sessionId: string): Promise<void> => {
    try {
        const headers = await getAuthHeader();
        if (!headers.Authorization) throw new Error("Cannot delete session: user is not authenticated")
        await axios.delete(`${HISTORY_ENDPOINT}/${sessionId}`, {
            params: {session_id: sessionId},
            headers: headers,
        });
    } catch (error) {
        console.error("Failed to delete session", error);
    }
}
