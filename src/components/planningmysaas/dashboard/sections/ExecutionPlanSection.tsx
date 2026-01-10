import { Search, Code, Users, Rocket, CheckCircle2, Cpu } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reportData } from "@/lib/reportMockData";

const iconMap: Record<string, React.ElementType> = {
  Search,
  Code,
  Users,
  Rocket,
};

const ExecutionPlanSection = () => {
  const { timeline, techStack } = reportData;

  return (
    <section id="execution-plan" className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Rocket className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">The Plan</h2>
          <p className="text-sm text-muted-foreground">How we build your project</p>
        </div>
      </div>

      {/* Timeline */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-8">Execution Timeline</h3>
          
          {/* Desktop Timeline - Horizontal */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
              
              <div className="grid grid-cols-4 gap-4 relative">
                {timeline.map((phase, index) => {
                  const IconComponent = iconMap[phase.icon] || Code;
                  return (
                    <div key={index} className="relative">
                      {/* Phase Circle */}
                      <div className="flex justify-center mb-4">
                        <div className="relative z-10 w-24 h-24 rounded-full bg-card border-2 border-accent flex flex-col items-center justify-center">
                          <IconComponent className="h-8 w-8 text-accent mb-1" />
                          <span className="text-xs text-muted-foreground">Phase {phase.phase}</span>
                        </div>
                      </div>

                      {/* Phase Content */}
                      <div className="text-center">
                        <h4 className="font-semibold text-foreground mb-1">{phase.name}</h4>
                        <Badge variant="outline" className="mb-3 text-xs">
                          {phase.duration}
                        </Badge>
                        <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                        
                        {/* Deliverables */}
                        <div className="text-left space-y-1.5">
                          {phase.deliverables.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs">
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
          <div className="lg:hidden space-y-6">
            {timeline.map((phase, index) => {
              const IconComponent = iconMap[phase.icon] || Code;
              return (
                <div key={index} className="relative flex gap-4">
                  {/* Vertical Line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-accent/30" />
                  )}
                  
                  {/* Phase Circle */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-card border-2 border-accent flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-accent" />
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{phase.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {phase.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                    
                    <div className="space-y-1.5">
                      {phase.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
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
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">Technology Stack</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((stack, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/20 border border-border/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">{stack.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {stack.techs.map((tech, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs bg-background/50"
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
