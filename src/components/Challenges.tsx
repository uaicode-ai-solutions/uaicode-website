import { Clock, DollarSign, AlertCircle, Target, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Challenges = () => {
  const navigate = useNavigate();

  const challenges = [
    {
      icon: Target,
      title: "Building for Nobody",
      description: "42% of startups fail because there is no market need. Without data, you are guessing with your savings.",
      highlighted: true
    },
    {
      icon: Clock,
      title: "Months of Wasted Time",
      description: "Every month building the wrong thing is a month your competitor spends capturing your market.",
      highlighted: false
    },
    {
      icon: DollarSign,
      title: "Burned Capital",
      description: "The average failed MVP costs $50K-$150K. That is runway you can never recover.",
      highlighted: false
    },
    {
      icon: AlertCircle,
      title: "Missed Market Window",
      description: "Your idea has a shelf life. Delays mean someone else launches first.",
      highlighted: false
    }
  ];

  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            What Happens When You <span className="text-gradient-gold">Skip Validation?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            These are the real costs founders pay when they build before they validate
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
            Book My Free Strategy Call
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            45 minutes with our founder. Complete AI validation. Zero cost.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Challenges;
