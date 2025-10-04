import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../../context/AuthContext";

const ChatInput: React.FC = () => {
    const isLoading = useAppState(state => state.isLoading);
    const sendChatMessage = useAppState(state => state.sendChatMessage);
    const sessionId = useAppState(state => state.sessionId); 
    
    const [input, setInput] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const trimmedInput = input.trim();
        if (trimmedInput && !isLoading && sessionId) {
            sendChatMessage(trimmedInput);
            setInput('');
        }
    };
    // const isDisabled = isLoading || !input.trim() || !sessionId;
    const isDisabled = false;

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2 p-3 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your document or type 'Quiz'..."
                disabled={isDisabled}
                className="flex-grow p-3 bg-gray-950 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
            />
            <button
                type="submit"
                disabled={isDisabled}
                className={`p-3 rounded-lg transition-colors ${
                    isDisabled
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-600 text-gray-900 hover:bg-yellow-500'
                }`}
            >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </button>
        </form>
    );
};
export default ChatInput;

