import { useState } from "react";
import { 
  CheckSquare, Square, ArrowRight, UserCircle, 
  Linkedin, Phone, Mail, MessageSquare, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import { ClientInfo } from "@/pages/PmsCloserFlow";

interface CloserWelcomeProps {
  clientInfo: ClientInfo;
  onClientInfoChange: (info: ClientInfo) => void;
  onStart: () => void;
}

const CHECKLIST_ITEMS = [
  { id: "linkedin", label: "Reviewed client's LinkedIn profile" },
  { id: "segment", label: "Identified industry/segment" },
  { id: "questions", label: "Prepared opening questions" },
  { id: "screenshare", label: "Tested screen sharing" },
];

const SPICED_SCRIPTS = [
  {
    letter: "S",
    label: "Situation",
    script: "Tell me about your current business. What are you working on today?",
    color: "text-blue-400",
  },
  {
    letter: "P",
    label: "Problem",
    script: "What's the biggest challenge or frustration you're facing right now?",
    color: "text-red-400",
  },
  {
    letter: "I",
    label: "Impact",
    script: "How is this problem affecting your revenue or growth?",
    color: "text-amber-400",
  },
  {
    letter: "C",
    label: "Critical Event",
    script: "What made you decide to act on this now? Was there a specific trigger?",
    color: "text-emerald-400",
  },
  {
    letter: "D",
    label: "Decision",
    script: "What does success look like for you in 6 months?",
    color: "text-purple-400",
  },
];

const CloserWelcome = ({ clientInfo, onClientInfoChange, onStart }: CloserWelcomeProps) => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const updateField = (field: keyof ClientInfo, value: string) => {
    onClientInfoChange({ ...clientInfo, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-premium border-b border-accent/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={uaicodeLogo} alt="Uaicode" className="h-9 w-9 rounded-lg" />
              <span className="text-lg font-bold text-foreground">
                Sales <span className="text-accent">Closer</span> Tool
              </span>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent text-xs">
              Pre-Call Setup
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 relative z-10">
        <div className="space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Prepare Your <span className="text-accent">Sales Call</span>
            </h1>
            <p className="text-muted-foreground">
              Review client info and prepare your opening before starting the interview.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Client Info Card */}
            <Card className="glass-card border-border/30">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">Client Info</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={clientInfo.name}
                        onChange={e => updateField("name", e.target.value)}
                        placeholder="John Doe"
                        className="pl-9 bg-background/50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={clientInfo.email}
                        onChange={e => updateField("email", e.target.value)}
                        placeholder="john@example.com"
                        className="pl-9 bg-background/50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={clientInfo.phone}
                        onChange={e => updateField("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="pl-9 bg-background/50"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={clientInfo.linkedin}
                        onChange={e => updateField("linkedin", e.target.value)}
                        placeholder="linkedin.com/in/johndoe"
                        className="pl-9 bg-background/50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pre-Call Checklist */}
            <Card className="glass-card border-border/30">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckSquare className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">Pre-Call Checklist</h2>
                </div>

                <div className="space-y-3">
                  {CHECKLIST_ITEMS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      {checkedItems.includes(item.id) ? (
                        <CheckSquare className="h-5 w-5 text-accent flex-shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        checkedItems.includes(item.id) 
                          ? "text-foreground" 
                          : "text-muted-foreground"
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 text-xs text-muted-foreground text-center">
                  {checkedItems.length}/{CHECKLIST_ITEMS.length} completed
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Opening Script */}
          <Card className="glass-card border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold text-foreground">Opening Script</h2>
                <Badge variant="outline" className="border-accent/30 text-accent text-xs ml-auto">
                  SPICED Framework
                </Badge>
              </div>

              {/* Personalized Opening */}
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/10 mb-4">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/90 italic">
                    "Hi {clientInfo.name || "[Name]"}, thanks for joining today! I'm excited to learn about your project. 
                    Before we dive into the analysis, I'd love to understand your business better so we can 
                    tailor everything to your specific needs..."
                  </p>
                </div>
              </div>

              {/* SPICED Questions */}
              <div className="space-y-3">
                {SPICED_SCRIPTS.map(item => (
                  <div key={item.letter} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full bg-card border border-border/50 flex items-center justify-center text-sm font-bold ${item.color} flex-shrink-0`}>
                      {item.letter}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${item.color} mb-0.5`}>{item.label}</p>
                      <p className="text-sm text-foreground/80">"{item.script}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={onStart}
              className="gap-3 bg-accent hover:bg-accent/90 text-background font-bold text-lg px-10 py-6 shadow-lg shadow-accent/20"
            >
              Start Interview
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CloserWelcome;
