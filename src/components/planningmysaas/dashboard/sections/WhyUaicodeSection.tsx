import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Award, 
  TrendingUp, 
  Package, 
  Clock, 
  Users, 
  Zap, 
  HeadphonesIcon, 
  Star,
  Quote,
  CheckCircle2,
  Building2
} from "lucide-react";

const statsData = [
  { 
    value: "94%", 
    label: "Success Rate", 
    sublabel: "Client satisfaction", 
    icon: TrendingUp, 
    highlight: true 
  },
  { 
    value: "47+", 
    label: "Projects Delivered", 
    sublabel: "MVPs launched", 
    icon: Package, 
    highlight: false 
  },
  { 
    value: "12", 
    label: "Avg. Weeks", 
    sublabel: "Time to market", 
    icon: Clock, 
    highlight: false 
  },
];

const differentials = [
  { 
    icon: Award, 
    title: "94% Success Rate", 
    description: "Projects delivered successfully on time and budget" 
  },
  { 
    icon: Users, 
    title: "SaaS-Specialized Team", 
    description: "Senior developers focused on digital products" 
  },
  { 
    icon: Zap, 
    title: "Agile Methodology", 
    description: "Weekly deliveries with demos and transparent communication" 
  },
  { 
    icon: HeadphonesIcon, 
    title: "Post-Launch Support", 
    description: "30 days of support included after go-live" 
  },
];

const testimonials = [
  {
    quote: "Uaicode delivered our MVP in 12 weeks with quality that exceeded expectations. Highly recommend.",
    name: "Sarah Mitchell",
    role: "CEO",
    company: "Startup Innovate",
  },
  {
    quote: "Professional, agile, and transparent. Exactly what we needed to bring our idea to life.",
    name: "Robert Taylor",
    role: "Founder",
    company: "TechFlow Solutions",
  },
];

const guarantees = [
  "Weekly demos for progress tracking",
  "Fixed price for MVP scope",
  "30 days post-launch support",
  "100% ownership of source code",
  "Complete documentation",
];

const StarRating = () => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
);

const WhyUaicodeSection = () => {
  return (
    <section id="why-uaicode" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Building2 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Why Uaicode</h2>
          <p className="text-sm text-muted-foreground">Our differentials and guarantees</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card 
              key={index} 
              className={`bg-card/50 border-border/30 ${stat.highlight ? 'border-accent/50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className={`text-3xl font-bold ${stat.highlight ? 'text-accent' : 'text-foreground'}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-foreground">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {stat.highlight && (
                      <Badge className="text-[9px] bg-accent/10 text-accent border-accent/30 px-1.5 py-0.5">
                        TOP RATED
                      </Badge>
                    )}
                    <div className="p-2 rounded-lg bg-accent/10">
                      <IconComponent className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Differentials and Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Our Differentials */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Our Differentials</h3>
            </div>
            <div className="space-y-3">
              {differentials.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-1.5 rounded-md bg-accent/10 mt-0.5">
                      <IconComponent className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* What Our Clients Say */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">What Our Clients Say</h3>
            </div>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Quote className="h-5 w-5 text-accent/40 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pl-7">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-[10px] bg-accent/10 text-accent">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs font-medium text-foreground">{testimonial.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                    <StarRating />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Our Guarantees */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <h3 className="text-sm font-semibold text-foreground">Our Guarantees</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {guarantees.map((guarantee, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-500/10 border border-green-500/20"
              >
                <CheckCircle2 className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400">{guarantee}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WhyUaicodeSection;
