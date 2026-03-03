import { Link } from "react-router-dom";
import { ArrowRight, MessageSquareText, Cpu, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    num: "01",
    icon: MessageSquareText,
    title: "Tell Us About Your Idea",
    desc: "Answer a few simple questions about your SaaS concept — what it does, who it's for, and what problem it solves.",
  },
  {
    num: "02",
    icon: Cpu,
    title: "Our AI Does the Heavy Lifting",
    desc: "Market research, competitor analysis, pricing strategy, financial modeling — all generated automatically in minutes.",
  },
  {
    num: "03",
    icon: FileCheck,
    title: "Get Your Complete Report",
    desc: "A ready-to-use strategy document you can share with investors, co-founders, or your team.",
  },
];

const LpHowItWorks = () => (
  <section className="relative py-24 md:py-32 px-4 overflow-hidden">
    {/* Background orb */}
    <div className="absolute bottom-0 left-[-5%] w-[500px] h-[500px] rounded-full bg-accent/6 blur-[130px] pointer-events-none" />

    <div className="relative z-10 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-foreground mb-4">
          From Idea to Strategy in{" "}
          <span className="text-gradient-gold">3 Simple Steps</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          No spreadsheets. No consultants. No weeks of research.
          Just answer, wait, and receive.
        </p>
      </div>

      {/* Steps */}
      <div className="relative space-y-8">
        {/* Connecting line */}
        <div className="absolute left-8 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent hidden md:block" />

        {steps.map((step) => (
          <div
            key={step.num}
            className="glass-premium rounded-2xl p-6 md:p-8 flex items-start gap-6 hover-lift relative"
          >
            {/* Step number */}
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center relative z-10">
              <span className="text-2xl md:text-3xl font-bold text-gradient-gold">
                {step.num}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <step.icon className="w-5 h-5 text-accent flex-shrink-0" />
                <h3 className="text-lg md:text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className="text-center mt-16">
        <Link to="/pms/wizard">
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 glow-white text-lg px-10 py-6 rounded-xl font-semibold group"
          >
            Start Now — It's Free
            <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        <p className="text-muted-foreground text-sm mt-4">
          No credit card required. No signup needed to start.
        </p>
      </div>
    </div>
  </section>
);

export default LpHowItWorks;
