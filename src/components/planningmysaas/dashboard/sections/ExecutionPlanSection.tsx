import { Search, Code, Users, Rocket, CheckCircle2, Cpu } from "lucide-react";
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

// Tech stack category colors
const categoryColors: Record<string, string> = {
  Frontend: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  Backend: "bg-green-500/10 border-green-500/20 text-green-400",
  Infra: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  Integrations: "bg-orange-500/10 border-orange-500/20 text-orange-400",
};

const ExecutionPlanSection = () => {
  const { timeline, techStack } = reportData;

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
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-6 text-sm">Execution Timeline</h3>
          
          {/* Desktop Timeline - Horizontal */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
              
              <div className="grid grid-cols-4 gap-3 relative">
                {timeline.map((phase, index) => {
                  const IconComponent = iconMap[phase.icon] || Code;
                  return (
                    <div key={index} className="relative group">
                      {/* Phase Circle with Number */}
                      <div className="flex justify-center mb-3">
                        <div className="relative z-10 w-20 h-20 rounded-full bg-card border-2 border-accent flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent/20">
                          <span className="text-lg font-bold text-accent">{phase.phase}</span>
                          <IconComponent className="h-5 w-5 text-accent/70" />
                        </div>
                      </div>

                      {/* Phase Content */}
                      <div className="text-center">
                        <h4 className="font-semibold text-foreground text-sm mb-1">{phase.name}</h4>
                        <Badge variant="outline" className="mb-2 text-xs">
                          {phase.duration}
                        </Badge>
                        <p className="text-xs text-muted-foreground mb-2">{phase.description}</p>
                        
                        {/* Deliverables */}
                        <div className="text-left space-y-1">
                          {phase.deliverables.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                          {phase.deliverables.length > 3 && (
                            <span className="text-xs text-accent">
                              +{phase.deliverables.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Timeline - Vertical */}
          <div className="lg:hidden space-y-4">
            {timeline.map((phase, index) => {
              const IconComponent = iconMap[phase.icon] || Code;
              return (
                <div key={index} className="relative flex gap-3">
                  {/* Vertical Line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-accent/30" />
                  )}
                  
                  {/* Phase Circle with Number */}
                  <div className="relative z-10 w-10 h-10 rounded-full bg-card border-2 border-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-accent">{phase.phase}</span>
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground text-sm">{phase.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {phase.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{phase.description}</p>
                    
                    <div className="space-y-1">
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
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground text-sm">Technology Stack</h3>
            <InfoTooltip side="right" size="sm">
              Modern, scalable technologies selected specifically for your project's needs.
            </InfoTooltip>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {techStack.map((stack, index) => {
              const colorClass = categoryColors[stack.category] || "bg-accent/10 border-accent/20 text-accent";
              return (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${colorClass.split(' ').slice(0, 2).join(' ')}`}
                >
                  <h4 className={`text-xs font-medium mb-2 ${colorClass.split(' ')[2]}`}>
                    {stack.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {stack.techs.map((tech, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-[10px] bg-background/50 px-1.5 py-0"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-3 italic">
            * Modern and scalable stack, chosen based on specific project needs
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default ExecutionPlanSection;
