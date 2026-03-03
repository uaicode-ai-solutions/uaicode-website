import { BarChart3, Search, Users, Calculator } from "lucide-react";

const deliverables = [
  {
    icon: Search,
    title: "Market Validation",
    desc: "Market size, demand signals, and growth potential — backed by data.",
  },
  {
    icon: BarChart3,
    title: "Competitive Intelligence",
    desc: "Competitors, pricing gaps, and positioning opportunities at a glance.",
  },
  {
    icon: Users,
    title: "Target Customer Profile",
    desc: "Pain points, demographics, and buying behavior of your ideal customer.",
  },
  {
    icon: Calculator,
    title: "Financial Projections",
    desc: "Revenue forecasts, unit economics, and 3-year ROI analysis.",
  },
];

const LpSolution = () => (
  <section className="relative py-24 md:py-32 px-4 overflow-hidden">
    {/* Gold accent glow */}
    <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[120px] pointer-events-none" />

    <div className="relative z-10 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-foreground mb-4">
          Everything You Need to<br />
          <span className="text-gradient-gold">Launch With Confidence</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          One report. Four powerful insights. Everything before you write code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-fade-in">
        {deliverables.map((d) => (
          <div
            key={d.title}
            className="glass-premium rounded-2xl p-8 hover-lift group"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 mb-5 transition-colors group-hover:bg-accent/20">
              <d.icon className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {d.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {d.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LpSolution;
