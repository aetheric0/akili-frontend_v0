import axios, { AxiosError } from "axios";
import { Upload, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useAppState } from "../../context/AuthContext";
import { DOCUMENT_UPLOAD_ENDPOINT, type ChatMessage, type SessionInfo } from "../../types";
import { supabase } from "../../lib/supabaseClient";

const UploadForm: React.FC = () => {
    const guest_token = useAppState(state => state.guest_token);
    const isLoading = useAppState(state => state.isLoading);
    const uploadError = useAppState(state => state.uploadError);
    const setUploadError = useAppState(state => state.setUploadError);
    const startNewSession = useAppState(state => state.startNewSession);

    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);


    
    // const ACCEPTED_FILE_MIMES = 
    //     'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';
        
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

        if (!guest_token) {
            setUploadError("User token not initialized. Please refresh the page.")
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        const { data: { session }} = await supabase.auth.getSession();

        const token = session?.access_token || guest_token;

        if (!token) {
            setUploadError("Authentication token is missing. Please refresh.");
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // --- CRITICAL FIX HERE: Ensure we hit the correct /upload/document endpoint ---
            const api_response = await axios.post(DOCUMENT_UPLOAD_ENDPOINT, formData, {
                headers: {
                    // Axios automatically sets 'Content-Type: multipart/form-data' 
                    // when sending a FormData object, but explicitly setting it is safer.
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { session_id, response} = api_response.data;

            const sessionInfo: SessionInfo = {
                id: session_id,
                document_name: file.name,
                created_at: new Date().toISOString(),
            }
            
            const initialMessage: ChatMessage = { 
                role: 'model', 
                text: response || "Document uploaded successfully. Ready to begin!" 
            };

            startNewSession(sessionInfo, initialMessage);
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
    }, [file, guest_token, setUploadError, startNewSession]);
    

    const isSubmitDisabled = isLoading || isUploading || !file;
    
    
    return (
        <form onSubmit={handleFileUpload} className="flex items-center space-x-2 p-2 bg-gray-800 rounded-lg shadow-inner w-full">
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