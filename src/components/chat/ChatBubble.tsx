import type { ChatMessage } from "../../types";
import formatMarkdownToHTML from "../../utils/markdownFormatter";

interface ChatBubbleProps {
    message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const formattedText = isUser ? message.text : formatMarkdownToHTML(message.text);
    const title = isUser ? 'You' : 'Akili AI';
    const bubbleClasses = isUser
        ? 'bg-blue-600 self-end rounded-br-none'
        : 'bg-gray-700 self-start rounded-tl-none';
    const titleColor = isUser ? 'text-blue-200' : 'text-yellow-400';

    return (
        <div className={`flex flex-col max-w-[90%] sm:max-w-[70%] p-3 rounded-xl shadow-xl mb-4 ${bubbleClasses}`}>
            <span className={`text-xs font-semibold mb-1 ${titleColor}`}>{title}</span>
            <div 
                className="text-white text-sm leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: formattedText }} 
            />
        </div>
    );
};

export default ChatBubble;