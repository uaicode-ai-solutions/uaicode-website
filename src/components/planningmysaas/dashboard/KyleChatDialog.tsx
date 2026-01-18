import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import KyleAvatar from "@/components/chat/KyleAvatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface KyleChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INITIAL_MESSAGE = "Hi! I'm Kyle, your sales consultant. How can I help you today?";

const QUICK_REPLIES = [
  "Tell me about pricing",
  "I want to schedule a call",
  "What services do you offer?"
];

const getMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("pricing") || lowerMessage.includes("price") || lowerMessage.includes("cost")) {
    return "Great question! Our Marketing service starts at $5,000/month and includes comprehensive market analysis, brand strategy, and growth planning. Would you like to schedule a call to discuss your specific needs?";
  }
  
  if (lowerMessage.includes("schedule") || lowerMessage.includes("call") || lowerMessage.includes("meeting")) {
    return "I'd love to set up a call! You can book directly through our calendar. Just scroll down to the 'Schedule Call' section in this report, or I can help you find a suitable time.";
  }
  
  if (lowerMessage.includes("service") || lowerMessage.includes("offer") || lowerMessage.includes("what do you")) {
    return "We offer end-to-end SaaS development and marketing services! This includes market validation, MVP development, brand identity, and growth strategy. The report you're viewing gives you a taste of our marketing analysis capabilities.";
  }
  
  return "Thanks for your message! I'm here to help you understand how we can accelerate your SaaS journey. Feel free to ask about our services, pricing, or schedule a call with our team.";
};

const KyleChatDialog = ({ open, onOpenChange }: KyleChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: INITIAL_MESSAGE }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: "user", content }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay and add mock response
    setTimeout(() => {
      const response = getMockResponse(content);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleReset = () => {
    setMessages([{ role: "assistant", content: INITIAL_MESSAGE }]);
    setInputValue("");
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden glass-card border-amber-500/20">
        <DialogTitle className="sr-only">Chat with Kyle - AI Sales Consultant</DialogTitle>
        
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="font-semibold text-foreground">AI Sales Consultant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Kyle Info */}
        <div className="flex flex-col items-center py-4 border-b border-border/30">
          <KyleAvatar isActive size="md" />
          <h3 className="mt-2 font-semibold text-foreground">Kyle</h3>
          <p className="text-sm text-muted-foreground">Sales Consultant</p>
          <Badge variant="outline" className="mt-2 text-xs border-green-500/50 text-green-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
            Online
          </Badge>
        </div>

        {/* Messages Area */}
        <div className="h-[250px] overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs h-7 hover:bg-amber-500/10 hover:border-amber-500/50"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-background border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim() || isTyping}
              className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <p className="text-center text-xs text-muted-foreground mt-3">
            💬 Chat powered by AI • Free consultation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KyleChatDialog;
