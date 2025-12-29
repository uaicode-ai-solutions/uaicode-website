import { MessageCircle, Sparkles } from "lucide-react";
import EveAvatar from "./EveAvatar";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8 animate-fade-in-up">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/3 rounded-full blur-3xl" />
      </div>
      
      {/* Avatar with glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl scale-150" />
        <EveAvatar size="lg" isActive />
      </div>
      
      {/* Welcome text */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Olá! Eu sou a <span className="text-gradient-gold">Eve</span>
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
        Sua assistente de IA. Estou aqui para ajudar você a descobrir como podemos transformar suas ideias em realidade.
      </p>
      
      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs text-muted-foreground">
          <MessageCircle className="w-3 h-3" />
          <span>Chat instantâneo</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          <span>Resposta inteligente</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
