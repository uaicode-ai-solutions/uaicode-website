import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, Zap, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyReports = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 
          flex items-center justify-center animate-pulse">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 
            flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-accent" />
          </div>
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent/60" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-accent/40" />
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
        Start Your First Validation
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-8 text-lg leading-relaxed">
        Create your first AI-powered SaaS validation report and get actionable insights 
        for your business idea.
      </p>
      
      {/* CTA Premium */}
      <Button 
        onClick={() => navigate("/planningmysaas/wizard")}
        size="lg"
        className="gap-3 bg-accent hover:bg-accent/90 text-background font-semibold 
          text-lg px-8 py-6 shadow-lg shadow-accent/30 hover:shadow-accent/40
          hover:scale-105 transition-all duration-300"
      >
        <Plus className="h-5 w-5" />
        Create Your First Report
      </Button>
      
      {/* Trust indicators */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
          <Zap className="h-4 w-4 text-accent" />
          <span>AI-Powered</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
          <Clock className="h-4 w-4 text-accent" />
          <span>5 min setup</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-border/50">
          <Shield className="h-4 w-4 text-accent" />
          <span>Secure</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyReports;
