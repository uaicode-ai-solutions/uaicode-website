import { Clock, DollarSign, AlertCircle, Target, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Challenges = () => {
  const navigate = useNavigate();

  const challenges = [
    {
      icon: Target,
      title: "Uncertain Market Fit",
      description: "Without validation, you risk building something nobody wants. 9 out of 10 startups fail because they skip this step.",
      highlighted: true
    },
    {
      icon: Clock,
      title: "Slow Development",
      description: "Traditional development takes months, delaying your market entry",
      highlighted: false
    },
    {
      icon: DollarSign,
      title: "High Costs",
      description: "Building in-house or hiring agencies drains your budget quickly",
      highlighted: false
    },
    {
      icon: AlertCircle,
      title: "Technical Hurdles",
      description: "Complex technical decisions slow you down and increase risk",
      highlighted: false
    }
  ];

  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            The Biggest Mistake? <span className="text-gradient-gold">Building Without Validating</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Before investing thousands in development, make sure your idea has real market potential
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            return (
              <div
                key={index}
                className={`glass-card p-6 rounded-lg hover-lift border transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,171,8,0.15)] ${
                  challenge.highlighted ? 'border-2 border-accent shadow-[0_0_30px_rgba(234,171,8,0.2)]' : 'border-accent/20 hover:border-accent/40'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4 border border-accent/30">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{challenge.title}</h3>
                <p className="text-muted-foreground">{challenge.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/planningmysaas")}
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 glow-white"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Validate My Idea
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Free AI-powered market analysis in minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default Challenges;
