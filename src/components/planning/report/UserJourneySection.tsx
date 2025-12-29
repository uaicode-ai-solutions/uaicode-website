import { Users, DollarSign, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UserJourneyProps {
  data: {
    steps: {
      step: number;
      title: string;
      description: string;
      revenuePoint: boolean;
    }[];
    engagementLoops: string[];
  };
}

export function UserJourneySection({ data }: UserJourneyProps) {
  return (
    <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          User Journey
        </h2>

        {/* Journey Steps */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-base font-semibold text-foreground">Customer Journey Map</h3>
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent to-accent/30 hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {data.steps.slice(0, 5).map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm z-10 ${
                      step.revenuePoint
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {step.step}
                  </div>
                  <div className="mt-3 space-y-2">
                    <h4 className="text-xs font-medium text-foreground">{step.title}</h4>
                    {step.revenuePoint && (
                      <Badge variant="outline" className="text-xs py-0 border-accent text-accent">
                        <DollarSign className="w-2.5 h-2.5 mr-0.5" />
                        Revenue
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Loops */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-accent" />
            Engagement & Retention Loops
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.engagementLoops.map((loop, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3 h-3 text-accent" />
                </div>
                <span className="text-xs text-foreground">{loop}</span>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
