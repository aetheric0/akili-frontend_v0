import axios from "axios";
import type { SessionInfo } from '../types/index';
import { getOrCreateGuestToken } from "../utils/guestToken";
import { HISTORY_ENDPOINT } from "../types/index";

const guestToken = getOrCreateGuestToken();

export const getSessionsApi = async (): Promise<SessionInfo[]> => {
    try {

        const response = await axios.get(HISTORY_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${guestToken}`
            }
        });
        return response.data as SessionInfo[];
    } catch (error) {
        console.error("Failed to fetch sessions:", error);
        return [];
    }
}

export const deleteSessionApi = async (sessionId: string): Promise<void> => {
    try {
        const response = await axios.delete(`${HISTORY_ENDPOINT}/${sessionId}`, {
            params: {session_id: sessionId},
            headers: {
                Authorization: `Bearer ${guestToken}`
            }
        });
        console.log(`Success ${response.status}`)
        return
    } catch (error) {
        console.error("Failed to delete session", error);
    }
}
