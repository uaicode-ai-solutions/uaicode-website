import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Calendar, Clock, Video, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ScheduleCallSectionProps {
  projectName?: string;
}

const ScheduleCallSection = ({ projectName }: ScheduleCallSectionProps) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "diagnostic-45min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#FFC61A" },
          light: { "cal-brand": "#FFC61A" }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  const features = [
    {
      icon: Clock,
      title: "45 Minutes",
      description: "Free consultation with no obligations"
    },
    {
      icon: Video,
      title: "Video Call",
      description: "Via Google Meet or Zoom"
    },
    {
      icon: CheckCircle2,
      title: "What We'll Cover",
      description: "Project review, timeline, pricing & Q&A"
    }
  ];

  return (
    <section id="schedule-call" className="space-y-6 animate-fade-in scroll-mt-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Calendar className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Schedule Your Call</h2>
          <p className="text-sm text-muted-foreground">
            Book a free 45-minute consultation to discuss {projectName ? `"${projectName}"` : "your project"}
          </p>
        </div>
      </div>

      {/* What to Expect Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card/50 border-border/30">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                <feature.icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cal.com Embed */}
      <Card className="bg-card/50 border-border/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="w-full h-[500px] md:h-[650px] overflow-auto">
            <Cal
              namespace="diagnostic-45min"
              calLink="uaicode-ai/diagnostic-45min"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", theme: "dark" }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground py-4 border-t border-border/30">
            Having trouble seeing the calendar?{" "}
            <a 
              href="https://cal.com/uaicode-ai/diagnostic-45min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Click here to open it in a new tab
            </a>
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default ScheduleCallSection;
