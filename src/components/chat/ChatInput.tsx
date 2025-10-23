import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useAppState } from "../../context/AuthContext";

const ChatInput: React.FC = () => {
  const isLoading = useAppState((state) => state.isLoading);
  const sendChatMessage = useAppState((state) => state.sendChatMessage);
  const activeSessionId = useAppState((state) => state.activeSessionId);
  const theme = useAppState((state) => state.theme);
  const isDark = theme === "dark";

  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading && activeSessionId) {
      sendChatMessage(trimmedInput);
      setInput("");
    }
  };

  const isDisabled = false;

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex space-x-2 p-3 rounded-xl shadow-2xl border transition-all duration-300
        ${isDark
          ? "bg-slate-900/40 border-gray-800"
          : "bg-white border-gray-300"
        }`}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question about your document or type 'Quiz'..."
        disabled={isDisabled}
        className={`flex-grow p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition
          ${isDark
            ? "bg-gray-950 text-white placeholder-gray-500"
            : "bg-gray-100 text-gray-900 placeholder-gray-500"
          }`}
      />
      <button
        type="submit"
        disabled={isDisabled}
        className={`p-3 rounded-lg transition-colors ${
          isDisabled
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : isDark
            ? "bg-yellow-600 text-gray-900 hover:bg-yellow-500"
            : "bg-yellow-400 text-gray-800 hover:bg-yellow-300"
        }`}
      >
        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
      </button>
    </form>
  );
};

export default ChatInput;
