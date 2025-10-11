import React, { useEffect, useState } from "react";
import type { ChatMessage } from "../../types";
import formatMarkdownToHTML from "../../utils/markdownFormatter";

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const title = isUser ? "You" : "Akili AI";
  
  // User Bubble: A dark, sophisticated slate color with a very subtle highlight border.
  const userBubbleClasses = "self-end bg-slate-900/60 ring-1 ring-inset ring-white/10";

  // AI Bubble: A gentle vertical gradient with a soft white border and a subtle glow.
  const aiBubbleClasses = `
    self-start relative bg-slate-800
    before:absolute before:inset-[-1px] before:rounded-xl
    before:bg-gradient-conic before:from-yellow-400/50 before:via-slate-700 before:to-slate-700
    before:blur-sm before:[animation:spin_5s_linear_infinite]
  `;

  const bubbleClasses = isUser ? userBubbleClasses : aiBubbleClasses;
  const titleColor = isUser ? "text-slate-300" : "text-yellow-400"; // Changed user title color

  const [formattedText, setFormattedText] = useState<string>(
    isUser ? message.text : ""
  );

    useEffect(() => {
    (async () => {
      let rawText: string;

      if (isUser) {
        rawText = message.text as string;
      } else {
        if (typeof message.text === "string") {
          rawText = message.text;
        } else if (message.text && typeof message.text === "object") {
          const textObj = message.text as Record<string, any>;
          const summary = textObj.summary || textObj.overview;
          const quiz = textObj.quiz || textObj.questions;
          
          if (summary || quiz) {
            rawText = `## Summary\n${summary ?? ""}\n\n## Quiz\n${
              Array.isArray(quiz)
                ? quiz.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n\n")
                : quiz ?? ""
            }`;
          } else {
            rawText = "```json\n" + JSON.stringify(textObj, null, 2) + "\n```";
          }
        } else {
          rawText = String(message.text ?? "");
        }
      }

      const html = await formatMarkdownToHTML(rawText);
      setFormattedText(html);
    })();
  }, [message.text, isUser]);

  return (
    <div className={`relative flex flex-col max-w-[90%] sm:max-w-[75%] p-4 rounded-xl shadow-lg mb-4 overflow-hidden ${bubbleClasses}`}>
     <div className="relative z-10">
        <span className={`text-xs font-bold mb-2 block ${titleColor}`}>{title}</span>
        <div
          className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedText }}
        />
      </div>
    </div>
  );
};

export default ChatBubble;