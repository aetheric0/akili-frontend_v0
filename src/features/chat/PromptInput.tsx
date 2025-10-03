import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../../context/AuthContext";

const PromptInput: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const { sendChatMessage, isLoading, setChatError, chatHistory } = useAppState();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        
        sendChatMessage(input);
        setInput('');
        setChatError(null);
    };

    const isInitialTaskComplete = chatHistory.some(msg => msg.isInitial);
    const placeholderText = isInitialTaskComplete 
        ? "Ask a follow-up question, or try: 'Take the quiz' / 'Explain X'"
        : "Type your first question after document upload...";

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800 sticky bottom-0 z-10">
            <div className="flex space-x-3 max-w-4xl mx-auto">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholderText}
                    disabled={isLoading}
                    className="flex-grow p-3 rounded-lg bg-gray-700 text-white border-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg disabled:bg-gray-600 transition duration-150 flex items-center justify-center w-12 h-12"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </div>
        </form>
    );
};

export default PromptInput;
