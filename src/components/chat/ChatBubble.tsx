import React, { useEffect, useState } from "react";
import type { ChatMessage } from "../../types";
import formatMarkdownToHTML from "../../utils/markdownFormatter";

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const title = isUser ? "You" : "Akili AI";
  const bubbleClasses = isUser
    ? "bg-blue-600 self-end rounded-br-none"
    : "bg-gray-800 self-start rounded-tl-none border border-gray-700";
  const titleColor = isUser ? "text-blue-200" : "text-yellow-400";

  const [formattedText, setFormattedText] = useState<string>(
    isUser ? message.text : ""
  );

  useEffect(() => {
    if (!isUser) {
      (async () => {
        const html = await formatMarkdownToHTML(message.text);
        setFormattedText(html);
      })();
    }
  }, [message.text, isUser]);

  return (
    <div
      className={`flex flex-col max-w-[90%] sm:max-w-[70%] p-5 rounded-2xl shadow-lg mb-6 ${bubbleClasses}`}
      style={{
        lineHeight: "1.75",
      }}
    >
      <span className={`text-xs font-semibold mb-2 ${titleColor}`}>{title}</span>

      <div
        className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-100 leading-relaxed"
        style={{
          fontSize: "0.95rem",
        }}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />

      {/* Optional subtle glow for AI responses */}
      {!isUser && (
        <div className="mt-3 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      )}
    </div>
  );
};

export default ChatBubble;
