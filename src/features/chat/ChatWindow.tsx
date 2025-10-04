import { Loader2, MessageSquare } from "lucide-react";
import { useRef, useEffect } from "react";
import { useAppState } from "../../context/AuthContext";
import ChatBubble from "../../components/chat/ChatBubble";

const ChatWindow: React.FC = () => {
    const chatHistory = useAppState(state => state.chatHistory);
    const sessionId = useAppState(state => state.sessionId);
    const isLoading = useAppState(state => state.isLoading);
    const chatError = useAppState(state => state.chatError);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, isLoading]);
    
    return (
        <>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #0000; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
            `}</style>
            
            <div className="flex flex-col space-y-4"> 
                
                {sessionId && chatHistory.map((msg, index) => (
                    <ChatBubble key={index} message={msg} />
                ))}
                
                {isLoading && (
                    <div className="self-start p-3 rounded-xl bg-gray-700 text-white shadow-lg">
                        <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
                        <span className="ml-2 text-sm">Akili is thinking...</span>
                    </div>
                )}
                
                {chatError && (
                    <div className="self-start p-3 rounded-xl bg-red-800 text-white shadow-lg">
                        <span className="font-bold">Error:</span> {chatError}
                    </div>
                )}
                
                {!sessionId && (
                    <div className="flex flex-col items-center justify-center text-center text-gray-500 p-8 min-h-[50vh]">
                         <MessageSquare className="w-12 h-12 mb-4" />
                        <p className="text-lg">Upload a document to start your study session with Akili AI.</p>
                        <p className="text-sm">Only the uploaded content will be used for summaries and quizzes.</p>
                    </div>
                )}
                
                <div ref={chatEndRef} />
            </div>
        </>
    );
};
export default ChatWindow;