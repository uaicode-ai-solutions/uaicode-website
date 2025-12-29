import { useState, useRef, useEffect } from "react";
import { RotateCcw, Send, Play, MessageCircle, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/uaicode-logo.png";
import SampleQuestions from "./demo/SampleQuestions";
import DemoCTAModal from "./demo/DemoCTAModal";
import PhoneInterface from "./PhoneInterface";
import { demoScenarios, demoWelcomeMessages, type DemoScenario } from "@/lib/demoConfig";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatSection = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoScenario, setDemoScenario] = useState<DemoScenario>('jewelry');
  const [demoMessageCount, setDemoMessageCount] = useState(0);
  const [showDemoCTA, setShowDemoCTA] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 😊 I'm Eve. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevLoadingRef = useRef(isLoading);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only refocus when loading completes (transition from true to false)
    if (prevLoadingRef.current === true && isLoading === false && inputRef.current) {
      inputRef.current.focus();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  const startDemo = (scenario: DemoScenario = 'jewelry') => {
    setIsDemoMode(true);
    setDemoScenario(scenario);
    setDemoMessageCount(0);
    setShowDemoCTA(false);
    setMessages([{
      role: "assistant",
      content: demoWelcomeMessages[scenario]
    }]);
  };

  const exitDemo = () => {
    setIsDemoMode(false);
    setDemoMessageCount(0);
    setShowDemoCTA(false);
    setMessages([{
      role: "assistant",
      content: "Hi! 😊 I'm Eve. How can I help you today?"
    }]);
  };

  const handleSchedule = () => {
    setShowDemoCTA(false);
    exitDemo();
    document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    // Increment demo message count
    if (isDemoMode) {
      const newCount = demoMessageCount + 1;
      setDemoMessageCount(newCount);
      
      // Show CTA after 7 messages
      if (newCount >= 7 && !showDemoCTA) {
        setTimeout(() => setShowDemoCTA(true), 2000);
      }
    }

    try {
      const functionName = isDemoMode ? 'demo-chat' : 'vapi-chat';
      const body = isDemoMode 
        ? { messages: newMessages, scenario: demoScenario }
        : { input: message };

      const { data, error } = await supabase.functions.invoke(functionName, { body });

      if (error) {
        throw error;
      }

      const assistantMessage = data?.output?.[0]?.content || "Sorry, I could not process your request.";

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: assistantMessage,
        },
      ]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      const errorMessage = error?.message || `Sorry, there was an error connecting to ${isDemoMode ? 'the demo' : 'Eve'}.`;
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, there was an error connecting to the chat service. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    if (isDemoMode) {
      setMessages([{
        role: "assistant",
        content: demoWelcomeMessages[demoScenario]
      }]);
      setDemoMessageCount(0);
      setShowDemoCTA(false);
    } else {
      setMessages([]);
    }
  };

  return (
    <section id="chat" className="py-24 bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Doubts? Talk to <span className="text-gradient-gold">Eve</span>!
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI assistant is here to help answer your questions
          </p>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-10 sm:h-11">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat with Eve
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call Eve
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="bg-background border border-border rounded-lg shadow-xl flex flex-col h-[500px] sm:h-[550px] md:h-[600px]">
          {/* Header */}
          <div className="bg-background border-b border-border p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Uaicode" className="w-8 h-8" loading="lazy" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-foreground">
                  {isDemoMode ? `${demoScenarios[demoScenario].name} Demo` : "Uaicode AI Solutions"}
                </h3>
                {isDemoMode ? (
                  <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20 text-xs">
                    <Play className="h-3 w-3 mr-1" />
                    Demo Mode
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Live Support
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isDemoMode && (
                <Button
                  onClick={exitDemo}
                  size="sm"
                  variant="outline"
                  className="h-9 px-3 text-xs"
                >
                  Exit Demo
                </Button>
              )}
              <Button
                onClick={handleReset}
                size="icon"
                className="h-9 w-9 bg-[#ffbd17] hover:bg-[#ffbd17]/90 text-black"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-8">
                <p>Start a conversation with our AI assistant</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-white text-black border border-border"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg p-3">
                  <p className="text-sm">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Questions for Demo Mode */}
          {isDemoMode && (
            <SampleQuestions 
              scenario={demoScenario}
              onSelect={(question) => {
                setInputValue(question);
                sendMessage(question);
              }}
            />
          )}

          {/* Input Area */}
          <div className="border-t border-border p-3 sm:p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isDemoMode ? "Ask about our jewelry collection..." : "Type your message..."}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isLoading}
                className="bg-[#ffbd17] hover:bg-[#ffbd17]/90 text-black"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
            </div>
          </TabsContent>

          <TabsContent value="phone">
            <PhoneInterface />
          </TabsContent>
        </Tabs>
        
        {/* Demo CTA Modal */}
        <DemoCTAModal
          open={showDemoCTA}
          onClose={() => setShowDemoCTA(false)}
          onSchedule={handleSchedule}
          onContinue={() => setShowDemoCTA(false)}
          scenario={demoScenario}
        />
      </div>
    </section>
  );
};

export default ChatSection;
