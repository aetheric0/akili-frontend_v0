import axios, { AxiosError } from "axios";
import { Upload, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAppState } from "../../context/AuthContext";
import { DOCUMENT_UPLOAD_ENDPOINT, type ChatMessage, type SessionInfo } from "../../types";

const UploadForm: React.FC = () => {
    const { isLoading, uploadError, setUploadError, startNewSession, isAuthReady, getToken, theme } = useAppState();
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const isDark = theme === "dark";
        
    useEffect(() => {
        if (uploadError) {
            const timer = setTimeout(() => setUploadError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [uploadError, setUploadError]);

    const handleFileUpload = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            const token = await getToken();
            if (!token) {
                setUploadError("Authentication token is missing. Please refresh.");
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const api_response = await axios.post(DOCUMENT_UPLOAD_ENDPOINT, formData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            });

            const data = api_response.data;

            // --- THIS IS THE FIX ---
            // 1. Create the SessionInfo object, matching the type EXACTLY.
            const sessionInfo: SessionInfo = {
                id: data.session_id,
                document_name: data.document_name,
                created_at: data.created_at,
                mode: data.mode,
            };
            
            // 2. Create the initial message separately.
            const initialMessage: ChatMessage = { 
                role: 'model', 
                text: data.response || "Document uploaded successfully!" 
            };

            // 3. Pass them as two separate, correct arguments.
            startNewSession(sessionInfo, initialMessage);
            setFile(null); 
            
        } catch (error) {
            const err = error as AxiosError<{ detail?: string }>;
            let errorMessage = "An unknown network error occurred.";
            if (err.response) {
                errorMessage = `API Error (${err.response.status}): ${err.response.data?.detail || err.message}`;
            } else if (err.request) {
                errorMessage = "No response from server.";
            } else {
                errorMessage = `Request Setup Error: ${err.message}`;
            }
            setUploadError("Upload Failed: " + errorMessage);
        } finally {
            setIsUploading(false);
        }
    }, [file, getToken, setUploadError, startNewSession]);
    
    const isSubmitDisabled = isLoading || isUploading || !file || !isAuthReady;
    
    return (
        <form onSubmit={handleFileUpload} className={`flex items-center space-x-2 p-2 rounded-lg shadow-inner w-full border ${isDark
          ? "bg-slate-900/40 border-gray-800"
          : "bg-white border-gray-300"
        }`}>
            <label 
                htmlFor="pdf-upload"
                className="flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors bg-yellow-600 text-gray-900 hover:bg-yellow-500"
                title="Upload a Document (PDF, DOCX, TXT)" /* ..*/
            >
                <Upload className="w-5 h-5" />
            </label>
            <input
                id="pdf-upload"
                type="file"
                accept='application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="hidden"
            />
            <span className="flex-grow text-sm truncate text-gray-400">
                {file ? file.name : "Select a document to begin..."}
            </span>
            <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                    isSubmitDisabled 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
            >
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Study"}
            </button>
        </form>
    );
};
export default UploadForm;