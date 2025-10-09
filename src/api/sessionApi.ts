import axios from "axios";
import type { SessionInfo } from '../types/index';
import { getOrCreateGuestToken } from "../utils/guestToken";

const SESSIONS_ENDPOINT = 'http://localhost:8000/sessions'

const sessionApi = async (): Promise<SessionInfo[]> => {
    try {
        const guestToken = getOrCreateGuestToken();

        const response = await axios.get(SESSIONS_ENDPOINT, {
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

export default sessionApi;