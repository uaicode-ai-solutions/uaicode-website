import { memo } from "react";
import EveAvatar from "./EveAvatar";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  isLatest?: boolean;
  isSpeaking?: boolean;
}

const ChatMessage = memo(({ role, content, timestamp, isLatest = false, isSpeaking = false }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} ${
        isLatest ? "animate-fade-in-up" : ""
      }`}
    >
      {/* Eve Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <EveAvatar size="sm" isActive={isLatest} isSpeaking={isSpeaking} />
        </div>
      )}

      {/* Message bubble */}
      <div className="flex flex-col max-w-[80%]">
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-accent text-accent-foreground rounded-br-md"
              : "bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-bl-md border border-border/50"
          } ${isLatest && !isUser ? "shadow-[0_0_20px_rgba(250,204,21,0.1)]" : ""}`}
        >
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        
        {/* Timestamp */}
        {timestamp && (
          <span 
            className={`text-[10px] text-muted-foreground/60 mt-1 ${
              isUser ? "text-right mr-1" : "ml-1"
            }`}
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
