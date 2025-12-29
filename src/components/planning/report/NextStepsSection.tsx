import { Rocket, Calendar, MessageSquare, Download, ArrowLeft, RefreshCw, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NextStepsSectionProps {
  companyName: string;
  recommendedPlan: string;
  onEditReport?: () => void;
  onRegenerateReport?: () => void;
  onNewReport?: () => void;
  isRegenerating?: boolean;
}

export function NextStepsSection({ 
  companyName, 
  recommendedPlan,
  onEditReport,
  onRegenerateReport,
  onNewReport,
  isRegenerating = false
}: NextStepsSectionProps) {
  const navigate = useNavigate();
  
  const steps = [
    {
      number: 1,
      title: "Review Your Report",
      description: "Take time to digest the analysis and share it with your team.",
      icon: Download,
    },
    {
      number: 2,
      title: "Schedule a Strategy Call",
      description: "Discuss your SaaS idea with our experts.",
      icon: Calendar,
    },
    {
      number: 3,
      title: "Start Building",
      description: `Begin with the ${recommendedPlan} plan.`,
      icon: Rocket,
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Rocket className="w-5 h-5 text-accent" />
        Next Steps
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-card border border-border rounded-xl p-4 space-y-3 relative overflow-hidden"
            >
              <div className="absolute -top-2 -right-2 text-6xl font-bold text-muted/10">
                {step.number}
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-accent/5 border border-accent/30 rounded-xl p-6 text-center space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">
            Ready to bring {companyName} to life?
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Our team specializes in turning SaaS ideas into successful products.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button 
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => navigate("/", { state: { scrollTo: "schedule" } })}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Strategy Call
          </Button>
          <Button 
            variant="outline" 
            className="border-border hover:bg-muted"
            onClick={() => navigate("/", { state: { scrollTo: "chat" } })}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat With Us
          </Button>
        </div>
      </div>

      {/* Navigation Actions */}
      {(onEditReport || onRegenerateReport || onNewReport) && (
        <div className="border-t border-border pt-6 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onEditReport && (
              <Button 
                variant="outline" 
                onClick={onEditReport}
                className="w-full sm:w-auto border-border hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            {onRegenerateReport && (
              <Button 
                variant="outline" 
                onClick={onRegenerateReport}
                disabled={isRegenerating}
                className="w-full sm:w-auto border-border hover:bg-muted"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerating...' : 'Regenerate Report'}
              </Button>
            )}
            {onNewReport && (
              <Button 
                onClick={onNewReport}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Report
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
