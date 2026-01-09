import { Award, Users, Zap, HeadphonesIcon, CheckCircle2, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { reportData } from "@/lib/reportMockData";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Users,
  Zap,
  HeadphonesIcon,
};

const WhyUaicodeSection = () => {
  const { uaicode } = reportData;

  return (
    <section id="why-uaicode" className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Award className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Por Que Uaicode</h2>
          <p className="text-sm text-muted-foreground">Nosso diferencial e garantias</p>
        </div>
      </div>

      {/* Stats Bar */}
      <Card className="bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border-accent/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent">{uaicode.successRate}%</div>
              <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">{uaicode.projectsDelivered}+</div>
              <p className="text-sm text-muted-foreground">Projetos Entregues</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">{uaicode.avgDeliveryWeeks}</div>
              <p className="text-sm text-muted-foreground">Semanas Média</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Differentials */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6">Nossos Diferenciais</h3>
            <div className="grid gap-4">
              {uaicode.differentials.map((diff, index) => {
                const IconComponent = iconMap[diff.icon] || Award;
                return (
                  <div 
                    key={index}
                    className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-border/30 hover:border-accent/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-accent/10 h-fit">
                      <IconComponent className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{diff.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{diff.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6">O Que Nossos Clientes Dizem</h3>
            <div className="space-y-4">
              {uaicode.testimonials.map((testimonial, index) => (
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
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-6 text-center">Nossas Garantias</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {uaicode.guarantees.map((guarantee, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20"
              >
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm text-foreground">{guarantee}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WhyUaicodeSection;
