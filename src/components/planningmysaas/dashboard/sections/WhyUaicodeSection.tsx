import { Card } from "@/components/ui/card";
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
    value: "10", 
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
    description: "45-120 days of support included after go-live" 
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
  "45-120 days post-launch support",
  "100% ownership of source code",
  "Complete documentation",
];

const WhyUaicodeSection = () => {
  return (
    <section id="why-uaicode" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10">
          <Award className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Why Uaicode</h2>
            <InfoTooltip size="sm">
              Our track record, differentials, and guarantees.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Our differentials and guarantees</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card 
              key={index} 
              className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                stat.highlight 
                  ? 'bg-card/50 border-amber-500/30 ring-2 ring-amber-500/20 hover:ring-amber-500/30 hover:shadow-amber-500/20' 
                  : 'bg-card/50 border-border/30 hover:border-accent/30 hover:shadow-accent/10'
              }`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/15 to-amber-400/5 rounded-bl-[40px] -mr-4 -mt-4"></div>
              
              <div className="relative p-5 text-center">
                {/* Centered icon */}
                <div className={`mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  stat.highlight ? 'bg-gradient-to-br from-amber-500/30 to-amber-400/20 ring-2 ring-amber-500/30' : 'bg-gradient-to-br from-amber-500/20 to-amber-400/10'
                }`}>
                  <IconComponent className={`h-6 w-6 ${stat.highlight ? 'text-amber-500' : 'text-amber-500/80'}`} />
                </div>
                
                {/* Value */}
                <div className={`text-3xl md:text-4xl font-bold mb-1 transition-transform duration-300 group-hover:scale-105 ${stat.highlight ? 'text-amber-500' : 'text-foreground'}`}>
                  {stat.value}
                </div>
                
                {/* Labels */}
                <p className="text-sm font-medium text-foreground mb-0.5">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                
                {/* TOP RATED Badge */}
                {stat.highlight && (
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      <span className="text-[10px] font-semibold text-amber-500 uppercase">Top Rated</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Differentials and Testimonials Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Our Differentials */}
        <Card className="bg-card/50 border-border/30">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-foreground text-sm">Our Differentials</h3>
              <InfoTooltip size="sm">
                What sets us apart from other development teams.
              </InfoTooltip>
            </div>
            <div className="grid gap-3">
              {differentials.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={index} 
                    className="flex gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-accent/30 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10 h-fit">
                      <IconComponent className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* What Our Clients Say */}
        <Card className="bg-card/50 border-border/30">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-foreground text-sm">What Our Clients Say</h3>
              <InfoTooltip size="sm">
                Real feedback from our satisfied clients.
              </InfoTooltip>
            </div>
            <div className="space-y-3">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/50 transition-colors"
                >
                  {/* Quote icon + Stars */}
                  <div className="flex items-start justify-between mb-2">
                    <Quote className="h-5 w-5 text-amber-500/50" />
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Quote text */}
                  <p className="text-foreground/90 italic text-sm mb-3">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-amber-500/20 text-amber-500">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-xs">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Our Guarantees */}
      <Card className="bg-card/50 border-border/30">
        <div className="p-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h3 className="font-semibold text-foreground text-sm">Our Guarantees</h3>
            <InfoTooltip size="sm">
              Our commitments to ensure your project's success.
            </InfoTooltip>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {guarantees.map((guarantee, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15 transition-colors cursor-default"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-foreground">{guarantee}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default WhyUaicodeSection;
