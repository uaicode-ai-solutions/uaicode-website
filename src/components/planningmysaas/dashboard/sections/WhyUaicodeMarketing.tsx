import { Award, Megaphone, TrendingUp, Zap, CheckCircle2, Quote, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const WhyUaicodeMarketing = () => {
  const stats = [
    { value: "94%", label: "Success Rate" },
    { value: "150+", label: "Campaigns" },
    { value: "4.2x", label: "Avg. ROAS" },
  ];

  const differentials = [
    { icon: Megaphone, title: "Full-Stack Execution" },
    { icon: TrendingUp, title: "Data-Driven" },
    { icon: Zap, title: "Fast Launch (3 weeks)" },
    { icon: Award, title: "SaaS Expertise" },
  ];

  const testimonials = [
    {
      quote: "5x growth in qualified leads within 3 months.",
      name: "Sarah Chen",
      role: "CMO, HealthFlow",
      initials: "SC"
    },
    {
      quote: "ROI exceeded our expectations.",
      name: "Michael Torres",
      role: "Founder, MedStack",
      initials: "MT"
    }
  ];

  const guarantees = ["Transparent reporting", "No lock-in contracts", "Dedicated manager", "Weekly calls"];

  return (
    <section id="why-uaicode-marketing" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Award className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Why Uaicode for Marketing</h2>
            <InfoTooltip size="sm">
              Our marketing services track record and differentials.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Full-service marketing execution for SaaS</p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            {/* Left: Stats + Pricing */}
            <div>
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-lg bg-muted/10 border border-border/20">
                    <div className="text-xl font-bold text-accent">{stat.value}</div>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Pricing */}
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-accent">$5,000</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Full-service marketing execution</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="border-accent/30 text-accent flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap gap-2 mt-3">
                {guarantees.map((g, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] border-border/30 text-muted-foreground">
                    <CheckCircle2 className="h-2.5 w-2.5 mr-1 text-accent" />
                    {g}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right: Differentials + Testimonials */}
            <div className="space-y-4">
              {/* Differentials Grid */}
              <div className="grid grid-cols-2 gap-2">
                {differentials.map((diff, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/10 border border-border/20">
                    <diff.icon className="h-4 w-4 text-accent flex-shrink-0" />
                    <span className="text-xs text-foreground">{diff.title}</span>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div className="space-y-2">
                {testimonials.map((t, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/10 border border-border/20">
                    <Quote className="h-3 w-3 text-accent/50 mb-1" />
                    <p className="text-xs text-foreground italic mb-2">"{t.quote}"</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-border/30">
                        <AvatarFallback className="bg-accent/20 text-accent text-[10px]">{t.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[10px] font-medium text-foreground">{t.name}</p>
                        <p className="text-[9px] text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WhyUaicodeMarketing;
