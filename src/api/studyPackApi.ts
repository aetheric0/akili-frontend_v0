// In a real project, we would import axios and the necessary types here.
// import axios, { AxiosError } from 'axios';
// import { ChatMessage } from '../types'; // assuming ChatMessage is imported

import axios, { type AxiosError } from "axios";
import { CHAT_ENDPOINT } from "../types";

/**
 * Sends a chat message to the Akili AI backend for follow-up questions.
 * @param sessionId The active session ID for context.
 * @param message The user's query.
 * @returns The AI's response text.
 */
export async function sendChatMessageApi(sessionId: string, message: string): Promise<string> {
    // Implementing exponential backoff for API calls
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await axios.post(CHAT_ENDPOINT, { 
                session_id: sessionId, 
                message: message 
            });
            const data = response.data as { response: string };
            return data.response || "Received empty response from Akili AI.";
        } catch (error) {
            const err = error as AxiosError<{ detail?: string }>;
            
            // Check for status codes that suggest retrying (e.g., 5xx errors, 429 rate limit)
            const shouldRetry = err.response && (err.response.status >= 500 || err.response.status === 429);
            
            if (attempt < MAX_RETRIES - 1 && shouldRetry) {
                const delay = INITIAL_DELAY * Math.pow(2, attempt);
                // Wait without logging the delay to the console as an error
                await new Promise(resolve => setTimeout(resolve, delay)); 
            } else {
                // Final failure, throw the detailed error
                let errorMessage = "An unknown network error occurred.";
                
                if (err.response) {
                    const detail = err.response.data?.detail;
                    errorMessage = `API Error (${err.response.status}): ${detail || err.message}`;
                } else if (err.request) {
                    errorMessage = "No response received from server. Check network connection.";
                } else {
                    errorMessage = `Request Setup Error: ${err.message}`;
                }
                
                throw new Error(errorMessage);
            }
        }
    }
    // Should be unreachable if logic above is correct, but for type safety:
    throw new Error("Failed to send chat message after multiple retries.");
}