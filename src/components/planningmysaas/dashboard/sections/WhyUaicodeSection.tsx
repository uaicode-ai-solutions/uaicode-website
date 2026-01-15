import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InfoTooltip } from "@/components/ui/info-tooltip";
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
  CheckCircle2
} from "lucide-react";
import sarahAvatar from "@/assets/testimonial-sarah-johnson.webp";
import marcusAvatar from "@/assets/author-marcus.webp";

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
    avatar: sarahAvatar,
  },
  {
    quote: "Professional, agile, and transparent. Exactly what we needed to bring our idea to life.",
    name: "Robert Taylor",
    role: "Founder",
    company: "TechFlow Solutions",
    avatar: marcusAvatar,
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
      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
);

const WhyUaicodeSection = () => {
  return (
    <section id="why-uaicode" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Award className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">Why Uaicode</h2>
            <InfoTooltip size="sm">
              Our track record, differentials, and guarantees.
            </InfoTooltip>
          </div>
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
              className={`relative overflow-hidden ${
                stat.highlight 
                  ? 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/40' 
                  : 'bg-card/80 border-border/40'
              }`}
            >
              {/* Badge TOP RATED - canto superior esquerdo */}
              {stat.highlight && (
                <Badge className="absolute top-3 left-3 text-[10px] bg-accent text-background font-semibold px-2 py-0.5 border-0">
                  <span className="mr-1 text-green-400">●</span> TOP RATED
                </Badge>
              )}
              
              {/* Ícone - canto superior direito com fundo sólido dourado */}
              <div className="absolute top-4 right-4 p-2.5 rounded-lg bg-accent">
                <IconComponent className="h-5 w-5 text-background" />
              </div>
              
              <CardContent className="p-6 pt-14 flex flex-col items-center justify-center text-center min-h-[140px]">
                <div className={`text-4xl md:text-5xl font-bold mb-1 ${stat.highlight ? 'text-accent' : 'text-foreground'}`}>
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
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
              <InfoTooltip size="sm">
                What sets us apart from other development teams.
              </InfoTooltip>
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
              <InfoTooltip size="sm">
                Real feedback from our satisfied clients.
              </InfoTooltip>
            </div>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="space-y-3 p-3 rounded-lg bg-accent/5">
                  {/* Quote + texto */}
                  <div className="flex items-start gap-3">
                    <Quote className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  
                  {/* Avatar + Info + Estrelas */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-accent/20 text-accent">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-foreground">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">
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
