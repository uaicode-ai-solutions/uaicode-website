import { Clock, DollarSign, AlertCircle, Target } from "lucide-react";

const Challenges = () => {
  const challenges = [
    {
      icon: Clock,
      title: "Slow Development",
      description: "Traditional development takes months, delaying your market entry",
      highlighted: true
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
    },
    {
      icon: Target,
      title: "Uncertain Market Fit",
      description: "Without rapid testing, you risk building something nobody wants",
      highlighted: false
    }
  ];

  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Got a Brilliant Idea, <span className="text-gradient-gold">But...</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Bringing a new software product to life can be complex, time-consuming, and expensive. We remove the roadblocks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            return (
              <div
                key={index}
                className={`glass-card p-6 rounded-lg hover-lift ${
                  challenge.highlighted ? 'border-2 border-accent' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{challenge.title}</h3>
                <p className="text-muted-foreground">{challenge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Challenges;
