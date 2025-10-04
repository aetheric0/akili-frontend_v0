import { AKILI_STATE_KEY } from "../types";

const getInitialSessionState = (): string | null => {
    try {
        const storedState = localStorage.getItem(AKILI_STATE_KEY);
        if (storedState) {
            const parsed = JSON.parse(storedState);
            return typeof parsed.sessionId === 'string' ? parsed.sessionId : null;
        }
    } catch (e) {
        console.error("Could not load state from localStorage:", e);
    }
    return null;
};
export default getInitialSessionState;