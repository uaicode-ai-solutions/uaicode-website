import { Search, Code, Users, Rocket, CheckCircle2, Cpu, Zap, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const iconMap: Record<string, React.ElementType> = {
  Search,
  Code,
  Users,
  Rocket,
};

const planLabels: Record<string, string> = {
  starter: "Starter Plan",
  growth: "Growth Plan",
  enterprise: "Enterprise Plan",
};

const planColors: Record<string, string> = {
  starter: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  growth: "bg-accent/20 text-accent border-accent/30",
  enterprise: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

// Tech stack category colors
// Category colors removed - using unified accent styling

const ExecutionPlanSection = () => {
  const { timeline, techStack, recommendedPlan } = reportData;

  // Calculate total time based on recommended plan
  const getTotalTime = () => {
    let minWeeks = 0;
    let maxWeeks = 0;
    
    timeline.forEach(phase => {
      const phaseData = phase as any;
      const duration = phaseData.planDurations?.[recommendedPlan] || phase.duration;
      const match = duration.match(/(\d+)-?(\d+)?/);
      if (match) {
        minWeeks += parseInt(match[1]);
        maxWeeks += parseInt(match[2] || match[1]);
      }
    });
    
    return `${minWeeks}-${maxWeeks} weeks`;
  };

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
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
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

            {/* Phases Grid */}
            <div className="grid grid-cols-4 gap-4 relative z-10">
              {timeline.map((phase, index) => {
                const IconComponent = iconMap[phase.icon] || Code;
                const phaseData = phase as any;
                const duration = phaseData.planDurations?.[recommendedPlan] || phase.duration;
                const isCurrentPlan = phaseData.planDurations && recommendedPlan;
                
                return (
                  <div
                    key={index}
                    className="group relative animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card */}
                    <div className="bg-gradient-to-b from-accent/5 to-transparent border border-accent/20 rounded-xl p-4 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 h-full">
                      {/* Phase Number & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 flex items-center justify-center group-hover:border-accent/50 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-300">
                          <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          Phase {phase.phase}
                        </span>
                      </div>

                      {/* Phase Info */}
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-medium text-foreground">{phase.name}</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-accent">{duration}</span>
                          {isCurrentPlan && (
                            <Badge className={`text-[10px] px-1.5 py-0 ${planColors[recommendedPlan]}`}>
                              {planLabels[recommendedPlan]}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{phase.description}</p>
                      </div>

                      {/* Deliverables - Show ALL */}
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
                    {index < timeline.length - 1 && (
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
            {timeline.map((phase, index) => {
              const IconComponent = iconMap[phase.icon] || Code;
              const phaseData = phase as any;
              const duration = phaseData.planDurations?.[recommendedPlan] || phase.duration;
              const isCurrentPlan = phaseData.planDurations && recommendedPlan;
              
              return (
                <div
                  key={index}
                  className="relative pl-8 pb-6 last:pb-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Vertical Line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-[11px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-accent/40 to-accent/10" />
                  )}
                  
                  {/* Icon Circle */}
                  <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
                    <IconComponent className="h-3 w-3 text-accent" />
                  </div>

                  {/* Card */}
                  <div className="bg-gradient-to-b from-accent/5 to-transparent border border-accent/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">{phase.name}</h4>
                      <span className="text-xs text-muted-foreground">Phase {phase.phase}</span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-accent">{duration}</span>
                      {isCurrentPlan && (
                        <Badge className={`text-[10px] px-1.5 py-0 ${planColors[recommendedPlan]}`}>
                          {planLabels[recommendedPlan]}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>

                    {/* Deliverables - Show ALL */}
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
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Total estimated time:</span>
                <span className="font-bold text-foreground text-lg">{getTotalTime()}</span>
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-400 gap-1.5">
                <Zap className="h-3 w-3" />
                54% faster than traditional agencies
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Cpu className="h-4 w-4 text-accent" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">Technology Stack</h3>
              <InfoTooltip side="right" size="sm">
                Modern, scalable technologies selected specifically for your project's needs.
              </InfoTooltip>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {techStack.map((stack, index) => (
              <div 
                key={index} 
                className="group relative p-4 rounded-xl bg-gradient-to-b from-accent/10 to-accent/5 border border-accent/20 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-0.5"
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-accent/15 rounded-bl-xl rounded-tr-xl" />
                
                {/* Category with indicator */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <h4 className="text-xs font-semibold text-accent uppercase tracking-wide">
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
            ))}
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
