import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Calendar, Shield, Clock } from "lucide-react";

// Avatar imports
import sarahJohnsonImg from "@/assets/testimonial-sarah-johnson.webp";
import emmaThompsonImg from "@/assets/testimonial-emma-thompson.webp";
import johnSmithImg from "@/assets/testimonial-john-smith.webp";
import mariaSantosImg from "@/assets/testimonial-maria-santos.webp";
import marcusChenImg from "@/assets/author-marcus.webp";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleCallSectionProps {
  projectName?: string;
}

// Countdown timer hook (synced with NextStepsSection via localStorage)
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
          <div className="flex -space-x-2">
            {[sarahJohnsonImg, marcusChenImg, emmaThompsonImg, johnSmithImg, mariaSantosImg].map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt="Founder" 
                className="w-6 h-6 rounded-full border-2 border-card object-cover"
              />
            ))}
          </div>
          <span className="text-foreground/80"><strong className="text-foreground">47</strong> founders booked this month</span>
        </div>
      </div>

      {/* Countdown Timer - PROMINENT */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
            <span className="text-base font-semibold">Offer expires in:</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-background/80 border border-amber-500/30 px-3 sm:px-4 py-2 rounded-lg text-center min-w-[60px] sm:min-w-[72px]">
              <span className="text-2xl sm:text-3xl font-bold text-gradient-gold">{formatTime(timeLeft.hours)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground block">HOURS</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-amber-400">:</span>
            <div className="bg-background/80 border border-amber-500/30 px-3 sm:px-4 py-2 rounded-lg text-center min-w-[60px] sm:min-w-[72px]">
              <span className="text-2xl sm:text-3xl font-bold text-gradient-gold">{formatTime(timeLeft.minutes)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground block">MINS</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-amber-400">:</span>
            <div className="bg-background/80 border border-amber-500/30 px-3 sm:px-4 py-2 rounded-lg text-center min-w-[60px] sm:min-w-[72px]">
              <span className="text-2xl sm:text-3xl font-bold text-gradient-gold">{formatTime(timeLeft.seconds)}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground block">SECS</span>
            </div>
          </div>
          <p className="text-sm text-amber-400 font-medium text-center">Lock in your 25% discount before time runs out!</p>
        </div>
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

      {/* Guarantees */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {guarantees.map((guarantee, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-foreground/80">
            <Shield className="h-4 w-4 text-emerald-500" />
            <span>{guarantee}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScheduleCallSection;
