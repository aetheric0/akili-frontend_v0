import axios, { AxiosError } from "axios";
import { UploadCloud, Loader2 } from "lucide-react";
import { useState } from "react";
import AlertBanner from "../../components/ui/AlertBanner";
import { useAppState } from "../../context/AuthContext";
import type { InitialMessagePayload } from "../../types";

const UploadForm: React.FC = () => {
    const { startNewSession, setLoading, isLoading, uploadError, setUploadError } = useAppState();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setUploadError("Only PDF documents are supported.");
            setFile(null);
        } else {
            setUploadError(null);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // API call logic (Simulating /api/studyPackApi.ts)
            const response = await axios.post('http://localhost:8000/upload/document', formData);
            const data = response.data as { session_id: string, response: string };
            
            const { session_id, response: initialResponseText } = data;

            if (!session_id || !initialResponseText) {
                 throw new Error("Invalid response format from server. Missing session_id or response.");
            }

            // Correctly assign the payload type to satisfy the startNewSession signature
            const initialMessagePayload: InitialMessagePayload = { text: initialResponseText };
            startNewSession(session_id, initialMessagePayload);

        } catch (error) {
            const err = error as AxiosError<{ detail?: string }>;
            let errorMessage = err.message;

            if (err.response) {
                errorMessage = `API Error (${err.response.status}): ${err.response.data?.detail || err.message}`;
            }

            console.error("Upload failed:", error);
            setUploadError(`Upload Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-xl shadow-2xl max-w-lg mx-auto text-white mt-16">
            <AlertBanner message={uploadError} type="error" onClose={() => setUploadError(null)} />

            <UploadCloud className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Start New Study Session</h2>
            <p className="text-gray-400 mb-6 text-center">
                Upload your **PDF document** to begin an Akili AI-powered chat session.
            </p>
            <form onSubmit={handleUpload} className="w-full space-y-4">
                <input 
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100
                    "
                />
                <button
                    type="submit"
                    disabled={!file || isLoading || !!uploadError}
                    className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition disabled:bg-gray-600 disabled:opacity-70"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <UploadCloud className="w-5 h-5 mr-2" />
                    )}
                    {isLoading ? 'Uploading...' : 'Upload & Chat'}
                </button>
            </form>
        </div>
    );
};
export default UploadForm;