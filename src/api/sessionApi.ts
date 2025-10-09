import axios from "axios";
import type { SessionInfo } from '../types/index';
import { getOrCreateGuestToken } from "../utils/guestToken";
import { HISTORY_ENDPOINT } from "../types/index";

const sessionApi = async (): Promise<SessionInfo[]> => {
    try {
        const guestToken = getOrCreateGuestToken();

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

export default sessionApi;