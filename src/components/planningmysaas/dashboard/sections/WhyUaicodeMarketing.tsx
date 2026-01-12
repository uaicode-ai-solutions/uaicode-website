import { Award, Megaphone, TrendingUp, Zap, CheckCircle2, Quote, DollarSign, Users, BarChart3, Palette, Target, LineChart, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const WhyUaicodeMarketing = () => {
  const stats = {
    campaignsLaunched: 150,
    avgROAS: "4.2x",
    successRate: 94
  };

  const differentials = [
    {
      icon: Megaphone,
      title: "Full-Stack Marketing Execution",
      description: "From strategy to implementation, we handle paid media, content, and growth marketing"
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Optimization",
      description: "Weekly performance reviews with actionable insights and continuous A/B testing"
    },
    {
      icon: Zap,
      title: "Fast Time-to-Market",
      description: "Launch your first campaigns within 2 weeks with our proven playbooks"
    },
    {
      icon: Award,
      title: "Industry Expertise",
      description: "Deep experience with SaaS, health tech, and B2B growth strategies"
    }
  ];

  const testimonials = [
    {
      quote: "Uaicode's marketing strategy helped us achieve 5x growth in qualified leads within 3 months.",
      name: "Sarah Chen",
      role: "CMO",
      company: "HealthFlow",
      initials: "SC"
    },
    {
      quote: "Their understanding of B2B SaaS marketing is unmatched. ROI exceeded our expectations.",
      name: "Michael Torres",
      role: "Founder",
      company: "MedStack",
      initials: "MT"
    }
  ];

  const guarantees = [
    "Transparent reporting",
    "No long-term contracts",
    "Dedicated account manager",
    "Weekly optimization calls"
  ];

  const serviceInclusions = [
    { icon: Target, text: "Strategy development & planning" },
    { icon: Megaphone, text: "Paid media management (Google, Meta, LinkedIn)" },
    { icon: Palette, text: "Content creation & copywriting" },
    { icon: LineChart, text: "Weekly optimization & reporting" },
    { icon: Users, text: "Dedicated account manager" },
    { icon: BarChart3, text: "A/B testing & creative iteration" }
  ];

  return (
    <section id="why-uaicode-marketing" className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Award className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Why Uaicode for Marketing</h2>
          <p className="text-sm text-muted-foreground">Our expertise in SaaS growth marketing</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Track Record</h3>
          <InfoTooltip size="sm">
            Key metrics from our marketing campaigns across SaaS clients.
          </InfoTooltip>
        </div>
        <Card className="glass-premium border-accent/20 overflow-hidden">
          <CardContent className="p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                <div className="text-xl md:text-2xl font-bold text-accent">{stats.successRate}%</div>
                <p className="text-xs text-muted-foreground">Client Success Rate</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="text-xl md:text-2xl font-bold text-foreground">{stats.campaignsLaunched}+</div>
                <p className="text-xs text-muted-foreground">Campaigns Launched</p>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="text-xl md:text-2xl font-bold text-foreground">{stats.avgROAS}</div>
                <p className="text-xs text-muted-foreground">Avg. ROAS Achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Card - $3,000/month */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Full-Service Marketing</h3>
          <InfoTooltip size="sm">
            Complete marketing execution for your SaaS including strategy, paid media, and content.
          </InfoTooltip>
        </div>
        <Card className="glass-premium border-accent/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="grid lg:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-3xl font-bold text-accent">$3,000</span>
                  <span className="text-base text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete marketing execution for your SaaS.
                  <InfoTooltip size="sm">
                    Ad spend budget is managed separately and billed directly to your ad accounts. We manage campaigns on your behalf without markup.
                  </InfoTooltip>
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Phone className="h-3.5 w-3.5 mr-1.5" />
                    Schedule Strategy Call
                  </Button>
                  <Button size="sm" variant="outline" className="border-accent/30 text-accent hover:bg-accent/10">
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    contato@uaicode.io
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-sm mb-3">What's Included:</h4>
                {serviceInclusions.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-accent/10">
                      <item.icon className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="text-foreground text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Differentials */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Our Marketing Differentials</h3>
            <InfoTooltip size="sm">
              What sets our marketing services apart from other agencies.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-accent/20">
            <CardContent className="p-5">
              <div className="grid gap-3">
                {differentials.map((diff, index) => (
                  <div 
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10 hover:border-accent/30 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-accent/10 h-fit">
                      <diff.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{diff.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{diff.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">What Our Clients Say</h3>
            <InfoTooltip size="sm">
              Feedback from SaaS founders and marketing leaders we've worked with.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-5">
              <div className="space-y-3">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-muted/20 border border-border/30"
                  >
                    <Quote className="h-4 w-4 text-accent/50 mb-2" />
                    <p className="text-foreground/90 italic text-sm mb-3">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-accent/20">
                        <AvatarFallback className="bg-accent/20 text-accent text-xs font-medium">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-xs">{testimonial.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Guarantees */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Our Guarantees</h3>
          <InfoTooltip size="sm">
            Commitments we make to every client we work with.
          </InfoTooltip>
        </div>
        <Card className="bg-card/50 border-accent/20">
          <CardContent className="p-5">
            <div className="flex flex-wrap justify-center gap-3">
              {guarantees.map((guarantee, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs text-foreground">{guarantee}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyUaicodeMarketing;