import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Sparkles, BarChart3, Mail } from "lucide-react";

interface WelcomeStepProps {
  onStart: () => void;
}

const WelcomeStep = ({ onStart }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 animate-step-enter max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-accent" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
        Validate Your <span className="text-gradient-gold">SaaS Idea</span>
      </h1>

      <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md">
        Answer a few quick questions and receive a complete AI-powered market validation report delivered to your inbox.
      </p>

      <div className="flex items-center gap-2 bg-muted/30 border border-border/30 rounded-full px-4 py-2 mb-8">
        <Clock className="w-4 h-4 text-accent" />
        <span className="text-sm text-muted-foreground">~3 minutes to complete</span>
      </div>

      <div className="grid grid-cols-1 gap-3 w-full mb-8">
        {[
          { icon: BarChart3, text: "Market analysis & competitive landscape" },
          { icon: Sparkles, text: "AI-powered feasibility assessment" },
          { icon: Mail, text: "Full report delivered to your email" },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm text-foreground/80">{text}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={onStart}
        size="lg"
        className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base"
      >
        Let's Start
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

export default WelcomeStep;
