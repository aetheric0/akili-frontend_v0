import { UploadCloud } from "lucide-react";
import { useRef, useEffect } from "react";
import AlertBanner from "../../components/ui/AlertBanner";
import { useAppState } from "../../context/AuthContext";
import PromptInput from "./PromptInput";

const ChatWindow: React.FC = () => {
    const { chatHistory, sessionId, chatError, setChatError } = useAppState();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chatHistory]);

    const hasInitialMessage = chatHistory.some(msg => msg.isInitial);
    const shouldShowGuidance = chatHistory.length === 1 && hasInitialMessage;

    return (
        // FIX: Added w-full and adjusted height to account for the p-4 padding on the main tag.
        // Changed rounded-b-xl to rounded-xl for a cleaner container look.
        <div className="flex flex-col w-full h-[calc(100vh-64px-32px)] bg-gray-900 rounded-xl shadow-2xl">
            <AlertBanner 
                message={chatError} 
                type="error" 
                onClose={() => setChatError(null)} 
            />

            <div className="p-4 border-b border-gray-700 bg-gray-800 text-sm text-gray-400 flex justify-between items-center rounded-t-xl">
                <span>Active Session ID: <span className="font-mono text-green-400 break-all">{sessionId}</span></span>
            </div>
            
            {/* Message History Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatHistory.length === 0 && (
                     <div className="text-center text-gray-500 pt-16">
                        <UploadCloud className="w-12 h-12 mx-auto mb-2" />
                        <p>Upload a PDF to start your Akili AI study session.</p>
                    </div>
                )}
                {chatHistory.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    const isInitialSystem = msg.isInitial;

                    if (isInitialSystem) {
                        return (
                            <div key={index} className="flex justify-center">
                                <div className="max-w-xl p-4 rounded-xl bg-yellow-900/50 text-yellow-300 shadow-xl text-sm italic border border-yellow-800">
                                    <p className="font-bold text-lg text-yellow-200 mb-2 not-italic border-b border-yellow-700 pb-1">
                                        Akili AI: Summary & Quiz
                                    </p>
                                    {/* Displays raw text with basic formatting for markdown output */}
                                    <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: msg.text }}>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Standard chat message rendering
                    return (
                        <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                                isUser 
                                    ? 'bg-green-600 text-white rounded-br-none' 
                                    : 'bg-gray-700 text-gray-100 rounded-tl-none'
                            }`}>
                                <p className="font-bold text-xs mb-1 opacity-70">
                                    {isUser ? 'You' : 'Akili AI'}
                                </p>
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                
                {shouldShowGuidance && (
                    <div className="text-center text-gray-500 pt-8">
                        <p className="font-semibold text-lg text-green-300 mb-2">
                            Review the Summary and Quiz!
                        </p>
                        <p>Ask a question about the text, or try **'Take the quiz'** in the input bar below.</p>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <PromptInput />
        </div>
    );
};
export default ChatWindow;