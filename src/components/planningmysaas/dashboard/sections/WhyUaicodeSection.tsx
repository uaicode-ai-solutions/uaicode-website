import { Award, Users, Zap, HeadphonesIcon, CheckCircle2, Quote, Star, TrendingUp, Package, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Users,
  Zap,
  HeadphonesIcon,
};

const WhyUaicodeSection = () => {
  const { uaicode } = reportData;

  // Stats data with metadata
  const statsData = [
    {
      value: `${uaicode.successRate}%`,
      label: "Success Rate",
      sublabel: "Client satisfaction",
      icon: TrendingUp,
      highlight: true,
    },
    {
      value: `${uaicode.projectsDelivered}+`,
      label: "Projects Delivered",
      sublabel: "MVPs launched",
      icon: Package,
      highlight: false,
    },
    {
      value: `${uaicode.avgDeliveryWeeks}`,
      label: "Avg. Weeks",
      sublabel: "Time to market",
      icon: Clock,
      highlight: false,
    },
  ];

  // Star rating component
  const StarRating = ({ rating = 5 }: { rating?: number }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} 
        />
      ))}
    </div>
  );

  return (
    <section id="why-uaicode" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Award className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Why Uaicode</h2>
            <InfoTooltip side="right" size="sm">
              Our track record, differentials, client testimonials, and guarantees for your project's success.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Our differentials and guarantees</p>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card 
              key={index}
              className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                stat.highlight 
                  ? 'bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 border-accent/40 ring-2 ring-accent/20 hover:ring-accent/40 hover:shadow-accent/20' 
                  : 'bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border-accent/20 hover:border-accent/30 hover:shadow-accent/10'
              }`}
            >
              {/* Decorative glow effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-[40px] -mr-4 -mt-4" />
              
              <CardContent className="relative p-5 text-center">
                {/* Icon */}
                <div className={`mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                  stat.highlight 
                    ? 'bg-accent/30 ring-2 ring-accent/40' 
                    : 'bg-accent/20'
                }`}>
                  <IconComponent className={`h-6 w-6 ${stat.highlight ? 'text-accent' : 'text-accent/80'}`} />
                </div>
                
                {/* Value */}
                <div className={`text-3xl md:text-4xl font-bold mb-1 transition-transform duration-300 group-hover:scale-105 ${
                  stat.highlight ? 'text-accent' : 'text-foreground'
                }`}>
                  {stat.value}
                </div>
                
                {/* Label */}
                <p className="text-sm font-medium text-foreground mb-0.5">{stat.label}</p>
                
                {/* Sublabel */}
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
                
                {/* Highlight badge for main stat */}
                {stat.highlight && (
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 border border-accent/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      <span className="text-[10px] font-semibold text-accent uppercase">Top Rated</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Differentials */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-4 text-sm">Our Differentials</h3>
            <div className="grid gap-3">
              {uaicode.differentials.map((diff, index) => {
                const IconComponent = iconMap[diff.icon] || Award;
                return (
                  <div 
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-accent/30 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="p-2 rounded-lg bg-accent/10 h-fit">
                      <IconComponent className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">{diff.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{diff.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-4 text-sm">What Our Clients Say</h3>
            <div className="space-y-3">
              {uaicode.testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Quote className="h-5 w-5 text-accent/50" />
                    <StarRating rating={5} />
                  </div>
                  <p className="text-foreground/90 italic text-sm mb-3">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-accent/20 text-accent text-xs">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-xs">{testimonial.name}</p>
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
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-4 text-center text-sm">Our Guarantees</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {uaicode.guarantees.map((guarantee, index) => (
              <div 
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors cursor-default"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                <span className="text-xs text-foreground">{guarantee}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WhyUaicodeSection;
