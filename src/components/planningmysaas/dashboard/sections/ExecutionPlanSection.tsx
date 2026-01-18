import { Search, Code, Users, Rocket, CheckCircle2, Cpu, Zap, Clock, ArrowRight, Server, Brain, Plug } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { getSectionInvestment } from "@/lib/sectionInvestmentUtils";

// ==========================================
// Fixed Execution Phases Data
// ==========================================

interface ExecutionPhaseConfig {
  phase: number;
  name: string;
  icon: React.ElementType;
  description: string;
  percentageOfProject: number;
  showPlanBadge?: boolean;
  deliverables: string[];
}

const EXECUTION_PHASES: ExecutionPhaseConfig[] = [
  {
    phase: 1,
    name: "Discovery",
    icon: Search,
    description: "Research, planning and architecture",
    percentageOfProject: 0.15,
    deliverables: [
      "Complete PRD",
      "Wireframes",
      "Architecture design",
      "Project timeline"
    ]
  },
  {
    phase: 2,
    name: "MVP Build",
    icon: Code,
    description: "AI-accelerated development",
    percentageOfProject: 0.50,
    showPlanBadge: true,
    deliverables: [
      "Authentication & users",
      "Core features",
      "Database & API",
      "Integrations",
      "Admin panel"
    ]
  },
  {
    phase: 3,
    name: "Beta",
    icon: Users,
    description: "Testing and iteration",
    percentageOfProject: 0.25,
    deliverables: [
      "Beta users onboarding",
      "Feedback collection",
      "Bug fixes",
      "Performance optimization"
    ]
  },
  {
    phase: 4,
    name: "Launch",
    icon: Rocket,
    description: "Go-to-market execution",
    percentageOfProject: 0.10,
    deliverables: [
      "Production deploy",
      "Marketing assets",
      "Support setup",
      "Monitoring & analytics"
    ]
  }
];

// ==========================================
// Fixed Technology Stack Data
// ==========================================

interface TechStackConfig {
  category: string;
  icon: React.ElementType;
  items: string[];
}

const TECH_STACK: TechStackConfig[] = [
  {
    category: "Frontend",
    icon: Code,
    items: ["React 18", "TypeScript", "TailwindCSS"]
  },
  {
    category: "Backend",
    icon: Server,
    items: ["Node.js", "PostgreSQL", "Supabase"]
  },
  {
    category: "AI",
    icon: Brain,
    items: ["GPT", "Claude", "Gemini"]
  },
  {
    category: "Integrations",
    icon: Plug,
    items: ["Stripe", "Delivery API", "SendGrid"]
  }
];

// ==========================================
// Plan Labels & Colors
// ==========================================

const planLabels: Record<string, string> = {
  starter: "Starter Plan",
  growth: "Growth Plan",
  enterprise: "Enterprise Plan",
};

const planColors: Record<string, string> = {
  starter: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  growth: "bg-accent/20 text-accent border-accent/30",
  enterprise: "bg-accent/20 text-accent border-accent/30",
};

// ==========================================
// Helper Functions
// ==========================================

/**
 * Calculate weeks for a phase based on total project weeks and phase percentage
 */
const calculatePhaseWeeks = (
  totalMinWeeks: number,
  totalMaxWeeks: number,
  percentage: number
): string => {
  const minWeeks = Math.max(1, Math.round(totalMinWeeks * percentage));
  const maxWeeks = Math.max(minWeeks, Math.round(totalMaxWeeks * percentage));
  
  if (minWeeks === maxWeeks) {
    return `${minWeeks} week${minWeeks > 1 ? 's' : ''}`;
  }
  return `${minWeeks}-${maxWeeks} weeks`;
};

// ==========================================
// Component
// ==========================================

const ExecutionPlanSection = () => {
  const { reportData } = useReportContext();
  
  // Get section_investment data for delivery weeks
  const sectionInvestment = getSectionInvestment(reportData);
  
  // Fallback delivery weeks based on typical Growth tier (9-13 weeks)
  const totalMinWeeks = sectionInvestment?.delivery_weeks_uaicode_min ?? 9;
  const totalMaxWeeks = sectionInvestment?.delivery_weeks_uaicode_max ?? 13;
  const mvpTier = (sectionInvestment?.mvp_tier?.toLowerCase() as "starter" | "growth" | "enterprise") ?? "growth";
  
  // Get traditional weeks for comparison
  const traditionalMinWeeks = sectionInvestment?.delivery_weeks_traditional_min ?? 26;
  const traditionalMaxWeeks = sectionInvestment?.delivery_weeks_traditional_max ?? 51;
  
  // Calculate "faster" percentage using average of min/max
  const avgUaicodeWeeks = (totalMinWeeks + totalMaxWeeks) / 2;
  const avgTraditionalWeeks = (traditionalMinWeeks + traditionalMaxWeeks) / 2;
  const fasterPercent = Math.round(((avgTraditionalWeeks - avgUaicodeWeeks) / avgTraditionalWeeks) * 100);
  
  // Total time display
  const totalTimeDisplay = totalMinWeeks === totalMaxWeeks 
    ? `${totalMinWeeks} weeks` 
    : `${totalMinWeeks}-${totalMaxWeeks} weeks`;

  return (
    <section id="execution-plan" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Rocket className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Plan</h2>
            <InfoTooltip side="right" size="sm">
              Detailed execution timeline, tech stack recommendations, and development phases for your MVP.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">How we build your project</p>
        </div>
      </div>

      {/* Timeline */}
      <Card className="bg-card/50 border-border/30 overflow-hidden">
        <CardContent className="p-6">
          {/* Timeline Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Execution Timeline</h3>
                <p className="text-xs text-muted-foreground">AI-accelerated development process</p>
              </div>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent gap-1.5 px-3 py-1">
              <Zap className="h-3.5 w-3.5" />
              AI-Accelerated
            </Badge>
          </div>

          {/* Desktop Timeline - Horizontal Cards */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-4 gap-4 relative z-10">
              {EXECUTION_PHASES.map((phase, index) => {
                const IconComponent = phase.icon;
                const phaseDuration = calculatePhaseWeeks(
                  totalMinWeeks,
                  totalMaxWeeks,
                  phase.percentageOfProject
                );
                
                return (
                  <div
                    key={index}
                    className="group relative animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card */}
                    <div className="bg-card/50 border border-border/30 rounded-xl p-4 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 h-full">
                      {/* Phase Number & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-400/10 border-2 border-amber-500/20 flex items-center justify-center group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-300">
                          <IconComponent className="h-6 w-6 text-amber-500" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          Phase {phase.phase}
                        </span>
                      </div>

                      {/* Phase Info */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-medium text-foreground">{phase.name}</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-amber-500">{phaseDuration}</span>
                          {phase.showPlanBadge && (
                            <Badge className={`text-[10px] px-1.5 py-0 ${planColors[mvpTier]}`}>
                              {planLabels[mvpTier]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{phase.description}</p>
                      </div>

                      {/* Deliverables */}
                      <div className="space-y-1.5 pt-3 border-t border-border/30">
                        {phase.deliverables.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-2 text-xs group/item"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow between cards */}
                    {index < EXECUTION_PHASES.length - 1 && (
                      <div className="hidden xl:flex absolute -right-2 top-14 z-20">
                        <ArrowRight className="h-4 w-4 text-accent/50" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Timeline - Vertical */}
          <div className="lg:hidden space-y-4">
            {EXECUTION_PHASES.map((phase, index) => {
              const IconComponent = phase.icon;
              const phaseDuration = calculatePhaseWeeks(
                totalMinWeeks,
                totalMaxWeeks,
                phase.percentageOfProject
              );
              
              return (
                <div
                  key={index}
                  className="relative pl-8 pb-6 last:pb-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Vertical Line */}
                  {index < EXECUTION_PHASES.length - 1 && (
                    <div className="absolute left-[11px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/40 to-amber-400/10" />
                  )}
                  
                  {/* Icon Circle */}
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-400/10 border border-amber-500/30 flex items-center justify-center">
                    <IconComponent className="h-3 w-3 text-amber-500" />
                  </div>

                  {/* Card */}
                  <div className="bg-card/50 border border-border/30 rounded-lg p-4 hover:border-accent/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">{phase.name}</h4>
                      <span className="text-xs text-muted-foreground">Phase {phase.phase}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-amber-500">{phaseDuration}</span>
                      {phase.showPlanBadge && (
                        <Badge className={`text-[10px] px-1.5 py-0 ${planColors[mvpTier]}`}>
                          {planLabels[mvpTier]}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>

                    {/* Deliverables */}
                    <div className="space-y-1 pt-2 border-t border-border/30">
                      {phase.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs">
                          <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Time Summary */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-muted-foreground">Total estimated time:</span>
                <span className="font-bold text-foreground text-lg">{totalTimeDisplay}</span>
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-400 gap-1.5">
                <Zap className="h-3 w-3" />
                {fasterPercent}% faster than traditional agencies
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
              <Cpu className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">Suggested Technology Stack</h3>
              <InfoTooltip side="right" size="sm">
                Recommended modern, scalable technologies tailored for your project's specific needs.
              </InfoTooltip>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TECH_STACK.map((stack, index) => {
              const IconComponent = stack.icon;
              return (
                <div 
                  key={index} 
                  className="group relative p-4 rounded-xl bg-card/50 border border-border/30 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-0.5"
                >
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-amber-500/20 to-amber-400/10 rounded-bl-xl rounded-tr-xl" />
                  
                  {/* Category with icon */}
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="w-3.5 h-3.5 text-amber-500" />
                    <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wide">
                      {stack.category}
                    </h4>
                  </div>
                  
                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {stack.items.map((tech, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-[10px] bg-background/80 border-border/50 text-foreground/80 px-2 py-0.5 hover:border-accent/40 hover:text-accent transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-4 italic">
            * Modern and scalable stack, chosen based on specific project needs
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default ExecutionPlanSection;
