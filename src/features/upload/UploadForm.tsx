import axios, { AxiosError } from "axios";
import { Upload, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import ChatInput from "../../components/chat/ChatInput";
import { useAppState } from "../../context/AuthContext";
import { DOCUMENT_UPLOAD_ENDPOINT, type ChatMessage } from "../../types";

const UploadForm: React.FC = () => {
    const sessionId = useAppState(state => state.sessionId);
    const isLoading = useAppState(state => state.isLoading);
    const uploadError = useAppState(state => state.uploadError);
    const setUploadError = useAppState(state => state.setUploadError);
    const startNewSession = useAppState(state => state.startNewSession);

    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);


    
    const ACCEPTED_FILE_MIMES = 
        'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';
        
    useEffect(() => {
        if (uploadError) {
            const timer = setTimeout(() => setUploadError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [uploadError, setUploadError]);

    const handleFileUpload = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!file) {
            setUploadError("Please select a document to upload.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // --- CRITICAL FIX HERE: Ensure we hit the correct /upload/document endpoint ---
            const response = await axios.post(DOCUMENT_UPLOAD_ENDPOINT, formData, {
                headers: {
                    // Axios automatically sets 'Content-Type: multipart/form-data' 
                    // when sending a FormData object, but explicitly setting it is safer.
                    'Content-Type': 'multipart/form-data', 
                },
            });

            const data = response.data as { session_id: string; response: string };
            
            const initialMessage: ChatMessage = { 
                role: 'model', 
                text: data.response || "Document uploaded successfully. Ready to begin!" 
            };

            startNewSession(data.session_id, initialMessage);
            setFile(null); 
            
        } catch (error) {
            const err = error as AxiosError<{ detail?: string }>;
            let errorMessage = "An unknown network error occurred during upload.";
            
            if (err.response) {
                const detail = err.response.data?.detail;
                errorMessage = `API Error (${err.response.status}): ${detail || err.message}`;
            } else if (err.request) {
                errorMessage = "No response received from server. Check network connection.";
            } else {
                errorMessage = `Request Setup Error: ${err.message}`;
            }
            
            setUploadError("Upload Failed: " + errorMessage);

        } finally {
            setIsUploading(false);
        }
    }, [file, setUploadError, startNewSession]);
    
    const isFormDisabled = sessionId !== null;

    const isSubmitDisabled = isFormDisabled || isLoading || isUploading || sessionId !== null;
    
    
    return (
        <div className="w-full">
            {uploadError && (
                <div className="mb-2 p-3 text-sm font-medium text-red-100 bg-red-600 rounded-lg">
                    {uploadError}
                </div>
            )}
            
            {/* Conditional rendering for the upload form when no session is active */}
            {!sessionId && (
                <form onSubmit={handleFileUpload} className="flex items-center space-x-2 p-2 bg-gray-800 rounded-lg shadow-inner">
                    <label 
                        htmlFor="pdf-upload" 
                        className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                            isFormDisabled ? 'bg-gray-600 text-gray-400' : 'bg-yellow-600 text-gray-900 hover:bg-yellow-500'
                        }`}
                        title="Upload a Document (PDF, DOCX, TXT)"
                    >
                        <Upload className="w-5 h-5" />
                    </label>
                    <input
                        id="pdf-upload"
                        type="file"
                        accept={ACCEPTED_FILE_MIMES} 
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        className="hidden"
                        disabled={isSubmitDisabled}
                    />
                    
                    <span className="flex-grow text-sm truncate text-gray-400">
                        {file ? file.name : "Select a PDF, DOCX, or TXT document..."}
                    </span>

                    <button
                        type="submit"
                        disabled={isSubmitDisabled || !file}
                        className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                            isSubmitDisabled || !file 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-500'
                        }`}
                    >
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Study"}
                    </button>
                </form>
            )}
            
            {/* Conditional rendering for the chat input when a session is active */}
            {sessionId && <ChatInput />}
        </div>
    );
};
export default UploadForm;