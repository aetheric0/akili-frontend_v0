import React, { useEffect, useState } from "react";
import type { ChatMessage } from "../../types";
import formatMarkdownToHTML from "../../utils/markdownFormatter";
import { useAppState } from "../../context/AuthContext";

interface ChatBubbleProps {
  message: ChatMessage;
  studyMode?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, studyMode = false }) => {
  const { theme } = useAppState(); // "light" | "dark"
  const isUser = message.role === "user";
  const title = isUser ? "You" : "Akili AI";

  // ✨ Light/Dark Theme aware background styling
  const userBubbleClasses = `
    self-end relative 
    ${theme === "dark" ? "bg-slate-900/25" : "bg-gray-100"}
    backdrop-blur-sm
    rounded-2xl px-6 py-5
    max-w-[85%] sm:max-w-[70%]
    shadow-[0_2px_12px_-3px_rgba(0,0,0,0.25)]
    ring-1 ring-inset ${studyMode ? "ring-yellow-400/50" : theme === "dark" ? "ring-white/10" : "ring-gray-300/50"}
  `;

  // 🧠 AI bubble — faint, airy, and now nearly borderless with full width
  const aiBubbleClasses = `
    self-start relative
    ${theme === "dark" ? "bg-slate-800/10" : "bg-gray-50"}
    backdrop-blur-sm
    border ${theme === "dark" ? "border-slate-700/5" : "border-gray-200/20"}
    rounded-2xl px-7 py-6 
    w-full sm:max-w-[100%] md:max-w-[90%]
    shadow-[0_0_14px_-6px_rgba(0,0,0,0.1)]
    before:absolute before:inset-[-1px] before:rounded-2xl
    before:bg-gradient-conic before:from-yellow-300/5 before:via-transparent before:to-transparent
    before:blur-sm before:[animation:spin_10s_linear_infinite]
  `;

  const bubbleClasses = isUser ? userBubbleClasses : aiBubbleClasses;
  const titleColor = isUser
    ? theme === "dark"
      ? "text-slate-200"
      : "text-gray-900"
    : theme === "dark"
      ? "text-yellow-400"
      : "text-yellow-600";

  const textColor = theme === "dark" ? "text-slate-50/95" : "text-gray-900/90";

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
    <div
      className={`relative flex flex-col rounded-2xl mb-5 overflow-hidden transition-all duration-200 ease-in-out ${bubbleClasses}`}
    >
      <span
        className={`text-[0.85rem] font-semibold mb-2 tracking-wide ${titleColor}`}
      >
        {title}
      </span>

      <div
        className={`
          prose prose-sm max-w-none
          ${theme === "dark" ? "prose-invert" : ""}
          text-[1.05rem]
          leading-[1.9]
          tracking-[0.015em]
          ${textColor}
          font-[460]
          break-words
        `}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />

      {!isUser && (
        <div
          className={`mt-5 w-full h-[1px] bg-gradient-to-r ${
            theme === "dark"
              ? "from-transparent via-slate-700/40 to-transparent"
              : "from-transparent via-gray-200 to-transparent"
          }`}
        />
      )}
    </div>
  );
};

export default ChatBubble;
