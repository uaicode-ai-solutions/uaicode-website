import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Calendar, Lock, FileText, Rocket, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleCallSectionProps {
  projectName?: string;
}

// Countdown timer hook
const useCountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const savedExpiry = localStorage.getItem('discountExpiry');
    let expiryTime: number;

    if (savedExpiry) {
      expiryTime = parseInt(savedExpiry);
    } else {
      expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('discountExpiry', expiryTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiryTime - now;

      if (diff <= 0) {
        // Reset timer for another 24h
        expiryTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('discountExpiry', expiryTime.toString());
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours: Math.max(0, hours), minutes: Math.max(0, minutes), seconds: Math.max(0, seconds) });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};

const ScheduleCallSection = ({ projectName }: ScheduleCallSectionProps) => {
  const timeLeft = useCountdownTimer();

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
      icon: Lock,
      title: "Lock Your Discount",
      description: "Confirm your exclusive pricing before the timer expires"
    },
    {
      icon: FileText,
      title: "Custom Proposal",
      description: "Get your detailed quote within 24 hours"
    },
    {
      icon: Rocket,
      title: "Fast Start",
      description: "Begin your project in just 7 days after approval"
    }
  ];

  const guarantees = [
    "No payment required to schedule",
    "Cancel anytime - no obligations",
    "Your discount is guaranteed once you book"
  ];

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <section id="schedule-call" className="space-y-6 animate-fade-in scroll-mt-24">
      {/* Header with Urgency */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-lg bg-accent/10">
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold text-foreground">🔒 Lock In Your Discount</h2>
              <Badge variant="outline" className="border-accent/50 text-accent text-xs">
                Limited Time Offer
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Schedule your call now to secure your exclusive discount on {projectName ? `"${projectName}"` : "your project"}
            </p>
          </div>
        </div>
        
        {/* Social Proof */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/5 px-3 py-1.5 rounded-full border border-accent/20">
          <Users className="h-4 w-4 text-accent" />
          <span><strong className="text-foreground">47</strong> founders booked this month</span>
        </div>
      </div>

      {/* What to Expect Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="bg-gradient-to-br from-background to-accent/5 border-accent/20">
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

      {/* Countdown Timer */}
      <Card className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-accent/30">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-foreground">Offer expires in:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="bg-background/80 text-accent font-mono font-bold text-xl px-3 py-1.5 rounded-lg border border-accent/30 shadow-lg shadow-accent/10">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="text-accent font-bold">:</span>
                <span className="bg-background/80 text-accent font-mono font-bold text-xl px-3 py-1.5 rounded-lg border border-accent/30 shadow-lg shadow-accent/10">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className="text-accent font-bold">:</span>
                <span className="bg-background/80 text-accent font-mono font-bold text-xl px-3 py-1.5 rounded-lg border border-accent/30 shadow-lg shadow-accent/10">
                  {formatTime(timeLeft.seconds)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guarantees */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {guarantees.map((guarantee, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-green-500" />
            <span>{guarantee}</span>
          </div>
        ))}
      </div>

      {/* Cal.com Embed */}
      <Card className="bg-card/50 border-accent/20 overflow-hidden">
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
