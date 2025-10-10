import axios from 'axios';
import { API_BASE_URL } from '../types';
import { getOrCreateGuestToken } from '../utils/guestToken'; // Assuming you have a helper for this

const STUDY_START_ENDPOINT = `${API_BASE_URL}/study/start`;
const STUDY_END_ENDPOINT = `${API_BASE_URL}/study/end`;

export async function startStudySessionApi(sessionId: string): Promise<void> {
    const token = getOrCreateGuestToken();
    if (!token) throw new Error("User token not found.");

    await axios.post(STUDY_START_ENDPOINT, { session_id: sessionId }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export async function endStudySessionApi(sessionId: string): Promise<{ new_xp: number }> {
    const token = getOrCreateGuestToken();
    if (!token) throw new Error("User token not found.");

    const response = await axios.post(STUDY_END_ENDPOINT, { session_id: sessionId }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.data; // Expecting backend to return { "new_xp": ... }
}