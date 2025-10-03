import { useAppState } from "../context/AuthContext";
import ChatWindow from "../features/chat/ChatWindow";
import UploadForm from "../features/upload/UploadForm";

const ChatPage: React.FC = () => {
    const { sessionId } = useAppState();

    return (
        // FIX: Added p-4 for margin/padding around the central chat box, improving layout.
        <main className="bg-gray-950 flex-grow p-4"> 
            {/* Custom CSS (Simulating /styles/global.css) */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4b5563;
                    border-radius: 20px;
                    border: 2px solid #1f2937;
                }
                .prose { color: inherit; }
                .prose h1, .prose h2, .prose h3 { margin-top: 1rem; margin-bottom: 0.5rem; font-weight: 700; }
                .prose p { margin-top: 0.5rem; margin-bottom: 0.5rem; }
                .prose ul, .prose ol { padding-left: 1.5em; margin-bottom: 0.5rem; }
                .prose ul { list-style-type: disc; }
                .prose ol { list-style-type: decimal; }
                .prose strong { font-weight: 700; color: #fff; }
            `}</style>
            <div className="container mx-auto max-w-4xl h-full">
                {/* Conditional render: ChatWindow if session exists, else UploadForm (LandingPage view) */}
                {sessionId ? (
                    <ChatWindow />
                ) : (
                    <UploadForm />
                )}
            </div>
        </main>
    );
};

export default ChatPage;