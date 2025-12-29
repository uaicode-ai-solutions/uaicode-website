import EveAvatar from "./EveAvatar";

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 justify-start animate-fade-in-up">
      <div className="flex-shrink-0 mt-1">
        <EveAvatar size="sm" isActive isSpeaking />
      </div>
      
      <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/80 text-foreground rounded-2xl rounded-bl-md px-4 py-3 border border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Eve is typing</span>
          <div className="flex items-center gap-1">
            <span 
              className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" 
              style={{ animationDelay: '0ms', animationDuration: '0.6s' }} 
            />
            <span 
              className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" 
              style={{ animationDelay: '150ms', animationDuration: '0.6s' }} 
            />
            <span 
              className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" 
              style={{ animationDelay: '300ms', animationDuration: '0.6s' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
