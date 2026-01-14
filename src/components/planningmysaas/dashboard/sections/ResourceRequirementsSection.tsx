import { Users, Clock, Briefcase, GraduationCap, Handshake, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const ResourceRequirementsSection = () => {
  const { resourceRequirements } = reportData;

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "high": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default: return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }
  };

  const founderTimePhases = [
    { ...resourceRequirements.founderTime.phase1, phase: 1 },
    { ...resourceRequirements.founderTime.phase2, phase: 2 },
    { ...resourceRequirements.founderTime.phase3, phase: 3 },
    { ...resourceRequirements.founderTime.phase4, phase: 4 },
  ];

  return (
    <section id="resource-requirements" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Users className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Beyond the Money</h2>
            <InfoTooltip side="right" size="sm">
              Resources beyond capital needed for success
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Time, team, and skills required for success</p>
        </div>
      </div>

      {/* Founder Time & Team Timeline */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Founder Time Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Founder Time Commitment</h3>
            </div>
            
            <div className="space-y-3">
              {founderTimePhases.map((phase, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                        Phase {phase.phase}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{phase.name}</span>
                    </div>
                    <span className="text-sm font-bold text-accent">{phase.hoursPerWeek}h/wk</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{phase.focus}</p>
                  <div className="mt-2 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full"
                      style={{ width: `${(phase.hoursPerWeek / 40) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Timeline Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Team Timeline</h3>
              <InfoTooltip size="sm">
                When to hire key roles as you scale
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {resourceRequirements.teamTimeline.map((hire, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  hire.critical 
                    ? 'bg-accent/5 border-accent/20' 
                    : 'bg-muted/10 border-border/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{hire.role}</span>
                      {hire.critical && (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                          Critical
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{hire.when}</span>
                    <span className="font-medium text-foreground">{hire.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Skills & External Support */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Critical Skills Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Critical Skills</h3>
            </div>
            
            <div className="space-y-3">
              {resourceRequirements.criticalSkills.map((skill, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{skill.skill}</span>
                    <Badge className={`${getImportanceColor(skill.importance)} text-xs`}>
                      {skill.importance}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Alternative:</span>
                    <span className="text-xs text-accent">{skill.alternative}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* External Support Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Handshake className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">External Support</h3>
              <InfoTooltip size="sm">
                Recommended external services and their costs
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {resourceRequirements.externalSupport.map((support, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/30">
                  <span className="text-sm text-foreground">{support.type}</span>
                  <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                    {support.cost}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Est. Total External Costs</span>
                <span className="text-lg font-bold text-accent">$3-6K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-green-500/20 flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-sm text-foreground/90">
            Start with {resourceRequirements.founderTime.phase1.hoursPerWeek} hours/week and scale to full-time by Phase 4. 
            First critical hire (Customer Success) needed around Month 4-6. 
            Total non-capital resources needed are manageable with proper planning.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ResourceRequirementsSection;
