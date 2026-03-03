import { TrendingDown, DollarSign, Clock, AlertTriangle } from "lucide-react";

const stats = [
  {
    icon: TrendingDown,
    stat: "90%",
    label: "of startups fail before reaching profitability",
  },
  {
    icon: DollarSign,
    stat: "$29B",
    label: "wasted yearly on ideas that never get validated",
  },
  {
    icon: Clock,
    stat: "6+ months",
    label: "spent on manual research that could be done in minutes",
  },
  {
    icon: AlertTriangle,
    stat: "73%",
    label: "of founders say they launched without proper validation",
  },
];

const LpProblem = () => (
  <section className="relative py-24 md:py-32 px-4 overflow-hidden">
    {/* Subtle red glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-destructive/5 blur-[150px] pointer-events-none" />

    <div className="relative z-10 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-foreground mb-4">
          90% of Startups Fail.{" "}
          <span className="text-gradient-gold">Most Never Saw It Coming.</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Building a SaaS without validation is like driving blindfolded.
          The data is out there — most founders just don't have time to find it.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade-in">
        {stats.map((s) => (
          <div
            key={s.stat}
            className="glass-premium rounded-2xl p-6 text-center hover-lift"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
              <s.icon className="w-6 h-6 text-accent" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
              {s.stat}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Emotional close */}
      <p className="text-center text-lg text-muted-foreground mt-14 italic max-w-xl mx-auto">
        "What if you could see the road ahead{" "}
        <span className="text-foreground font-medium">before</span> you start driving?"
      </p>
    </div>
  </section>
);

export default LpProblem;
