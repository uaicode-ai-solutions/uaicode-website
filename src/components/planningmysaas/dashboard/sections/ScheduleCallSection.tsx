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
    const savedExpiry = localStorage.getItem('pms_offer_expiry_24h');
    let expiryTime: number;

    if (savedExpiry) {
      expiryTime = parseInt(savedExpiry);
    } else {
      expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('pms_offer_expiry_24h', expiryTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = expiryTime - now;

      if (diff <= 0) {
        // Reset timer for another 24h
        expiryTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('pms_offer_expiry_24h', expiryTime.toString());
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
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/20">
            <Calendar className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold text-foreground">Book Your Call</h2>
              <Badge 
                className="text-xs font-semibold border-0 text-black"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
              >
                Limited Time Offer
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure your exclusive discount before time runs out
            </p>
          </div>
        </div>
        
        {/* Social Proof */}
        <div className="flex items-center gap-2 text-sm glass-card px-4 py-2 rounded-full border border-amber-500/20">
          <Users className="h-4 w-4 text-amber-400" />
          <span className="text-foreground/80"><strong className="text-foreground">47</strong> founders booked this month</span>
        </div>
      </div>

      {/* Guarantees */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {guarantees.map((guarantee, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-foreground/80">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>{guarantee}</span>
          </div>
        ))}
      </div>

      {/* Cal.com Embed */}
      <Card className="glass-card border-border/30 overflow-hidden">
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
              className="text-amber-400 hover:underline"
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
