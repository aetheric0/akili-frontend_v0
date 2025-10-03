// In a real project, we would import axios and the necessary types here.
// import axios, { AxiosError } from 'axios';
// import { ChatMessage } from '../types'; // assuming ChatMessage is imported

import axios, { type AxiosError } from "axios";

// Define the shape of the successful response data
interface ChatResponse {
    response: string;
}

/**
 * Sends a chat message to the Akili AI backend for follow-up questions.
 * @param sessionId The active session ID for context.
 * @param message The user's query.
 * @returns The AI's response text.
 */
export async function sendChatMessageApi(
    sessionId: string, 
    message: string
): Promise<string> {
    try {
        // This is the core API call logic
        const response = await axios.post('http://localhost:8000/upload/chat', { 
            session_id: sessionId, 
            message: message 
        });

        const data = response.data as ChatResponse;
        
        // Handle empty response gracefully
        return data.response || "Received empty response from Akili AI.";

    } catch (error) {
        // Robust error handling logic
        const err = error as AxiosError<{ detail?: string }>;
        let errorMessage: string;
        
        if (err.response) {
            // Server responded with a status code outside the 2xx range
            const detail = err.response.data?.detail;
            errorMessage = `API Error (${err.response.status}): ${detail || err.message}`;
        } else if (err.request) {
            // Request was made but no response received
            errorMessage = "No response received from server. Check network connection.";
        } else {
            // Something happened in setting up the request
            errorMessage = `Request Setup Error: ${err.message}`;
        }

        // Throw the translated error message for the Zustand store to catch
        throw new Error(errorMessage);
    }
}

// export async function uploadDocumentApi(...) { ... } 
// Other API functions would also live here.
