import { Award, Megaphone, TrendingUp, Zap, CheckCircle2, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      avatar: ""
    },
    {
      quote: "Their understanding of B2B SaaS marketing is unmatched. ROI exceeded our expectations.",
      name: "Michael Torres",
      role: "Founder",
      company: "MedStack",
      avatar: ""
    }
  ];

  const guarantees = [
    "Transparent reporting",
    "No long-term contracts",
    "Dedicated account manager",
    "Weekly optimization calls"
  ];

  return (
    <section id="why-uaicode-marketing" className="space-y-8">
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
      <Card className="glass-premium border-accent/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent">{stats.successRate}%</div>
              <p className="text-sm text-muted-foreground">Client Success Rate</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">{stats.campaignsLaunched}+</div>
              <p className="text-sm text-muted-foreground">Campaigns Launched</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">{stats.avgROAS}</div>
              <p className="text-sm text-muted-foreground">Avg. ROAS Achieved</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Differentials */}
        <Card className="bg-card/50 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6">Our Marketing Differentials</h3>
            <div className="grid gap-4">
              {differentials.map((diff, index) => (
                <div 
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-accent/5 border border-accent/10 hover:border-accent/30 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-accent/10 h-fit">
                    <diff.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{diff.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{diff.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6">What Our Clients Say</h3>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-muted/20 border border-border/30"
                >
                  <Quote className="h-6 w-6 text-accent/50 mb-3" />
                  <p className="text-foreground/90 italic mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-accent/20 text-accent">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
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

      {/* Guarantees */}
      <Card className="bg-card/50 border-accent/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-6 text-center">Our Guarantees</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {guarantees.map((guarantee, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20"
              >
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span className="text-sm text-foreground">{guarantee}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WhyUaicodeMarketing;
