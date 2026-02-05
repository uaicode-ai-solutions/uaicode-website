import { Sparkles, Compass, Target, GitBranch, BarChart, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import deliverySupport from "@/assets/delivery-support.webp?v=2";
import deliveryTraining from "@/assets/delivery-training.webp?v=2";
import deliveryTeam from "@/assets/delivery-team.webp?v=2";
import deliveryMeetings from "@/assets/delivery-meetings.webp?v=2";

const Deliveries = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const deliveries = [
    {
      title: "Speed Without Shortcuts",
      description: "Launch-ready MVPs in 4-8 weeks using AI-powered development tools, proven frameworks, and battle-tested patterns. Fast iteration cycles mean you validate ideas quickly and pivot based on real user feedback.",
      image: deliverySupport,
    },
    {
      title: "Built to Scale",
      description: "Architecture designed for growth from day one. Clean code, modern infrastructure, and scalable databases ensure your MVP evolves smoothly as you grow from 10 to 10,000 users without costly rewrites.",
      image: deliveryTeam,
    },
    {
      title: "Lean & Focused",
      description: "We help you prioritize ruthlessly - building only what validates your core hypothesis. No feature bloat, no unnecessary complexity. Just the essential functionality to test your market fit fast.",
      image: deliveryMeetings,
    },
    {
      title: "Technical Excellence",
      description: "Production-ready code, security best practices, and modern tech stack from the start. Your MVP isn't a throwaway prototype - it's a solid foundation you can confidently build your business on.",
      image: deliveryTraining,
    },
  ];



  const icons = [Target, GitBranch, BarChart, Rocket];

  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What Makes Us <span className="text-gradient-gold">Different</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            After you validate your idea, here's what you get when you build with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {deliveries.map((delivery, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl hover-lift text-center group border border-accent/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,171,8,0.15)] hover:border-accent/40"
              >
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img
                    src={delivery.image}
                    alt={delivery.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{delivery.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {delivery.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => navigate("/planningmysaas")}
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 glow-white"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Validate My Idea
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("how-it-works")}
            className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 transition-all duration-300"
          >
            <Compass className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
            Our Process
          </Button>
        </div>
      </div>

    </section>
  );
};

export default Deliveries;
