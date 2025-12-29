import { Code, Server, Cloud, Package, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TechnicalFeasibilityProps {
  data: {
    overview: string;
    recommendedStack: {
      frontend: string[];
      backend: string[];
      infrastructure: string[];
      thirdParty: string[];
    };
    developmentPhases: {
      phase: string;
      duration: string;
      deliverables: string[];
    }[];
    technicalChallenges: {
      challenge: string;
      solution: string;
      difficulty: "low" | "medium" | "high";
    }[];
  };
}

export function TechnicalFeasibilitySection({ data }: TechnicalFeasibilityProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const stackCategories = [
    { key: "frontend", label: "Frontend", icon: Code, color: "text-blue-500" },
    { key: "backend", label: "Backend", icon: Server, color: "text-green-500" },
    { key: "infrastructure", label: "Infrastructure", icon: Cloud, color: "text-purple-500" },
    { key: "thirdParty", label: "Third-Party Services", icon: Package, color: "text-orange-500" },
  ] as const;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Code className="w-5 h-5 text-accent" />
        Technical Feasibility
      </h2>

      {/* Overview */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{data.overview}</p>
      </div>

      {/* Recommended Tech Stack - Reorganized */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h3 className="text-base font-semibold text-foreground">Recommended Tech Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stackCategories.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
              <ul className="space-y-2">
                {data.recommendedStack[key].map((tech, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Development Phases */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          Development Phases
        </h3>
        <div className="space-y-3">
          {data.developmentPhases.map((phase, index) => (
            <div
              key={index}
              className="relative pl-6 pb-4 border-l-2 border-accent/30"
            >
              <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1/2 rounded-full bg-accent" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-medium text-foreground">{phase.phase}</h4>
                  <Badge variant="outline" className="text-xs py-0">
                    {phase.duration}
                  </Badge>
                </div>
                <ul className="space-y-0.5">
                  {phase.deliverables.map((deliverable, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          
          {/* Go Live - Fixed final milestone */}
          <div className="relative pl-6 pb-0 border-l-2 border-accent/30">
            <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1/2 rounded-full bg-green-500" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-medium text-foreground">🚀 Go Live</h4>
                <Badge variant="outline" className="text-xs py-0 bg-green-500/10 text-green-500 border-green-500/20">
                  Milestone
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Product launch and deployment to production environment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Challenges */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-accent" />
          Technical Challenges & Solutions
        </h3>
        <div className="space-y-3">
          {data.technicalChallenges.map((item, index) => (
            <div
              key={index}
              className="bg-muted/30 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium text-foreground">{item.challenge}</h4>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs py-0 ${getDifficultyColor(item.difficulty)}`}
                >
                  {item.difficulty}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent font-medium">Solution: </span>
                {item.solution}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
