import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import founderPhoto from "@/assets/founder-rafael-luz.webp";

const LpFounder = () => (
  <section className="relative py-24 md:py-32 px-4 overflow-hidden">
    <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/6 blur-[130px] pointer-events-none" />

    <div className="relative z-10 max-w-4xl mx-auto">
      <div className="glass-premium rounded-2xl p-8 md:p-12 hover-lift">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          {/* Left — Photo & credentials */}
          <div className="flex flex-col items-center text-center flex-shrink-0">
            <div className="relative mb-4">
              <div className="absolute -inset-2 bg-gradient-to-br from-accent/30 to-accent/5 rounded-full blur-xl" />
              <img
                src={founderPhoto}
                alt="Rafael Luz — Founder & CEO at Uaicode.ai"
                loading="lazy"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-accent/30 shadow-xl"
              />
            </div>
            <h3 className="text-lg font-bold text-foreground">Rafael Luz</h3>
            <p className="text-sm text-muted-foreground mb-2">Founder & CEO at Uaicode.ai</p>
            <Badge className="bg-accent/10 text-accent border-accent/20 gap-1.5">
              <Award className="w-3 h-3" />
              Ex-Microsoft AI Solutions Architect
            </Badge>
          </div>

          {/* Right — Copy & CTA */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              Got Questions After Your Report?{" "}
              <span className="text-gradient-gold">Talk Strategy With an Expert</span>
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-6">
              After receiving your free report, you'll have the option to book a 1-on-1
              strategy session with Rafael Luz — former Microsoft AI Solutions Architect
              who has helped 100+ founders turn validated ideas into launched products.
              No pitch. Just real, actionable advice for your specific idea.
            </p>

            <p className="text-xs text-muted-foreground/60 italic mb-6">
              Available exclusively after you receive your report
            </p>

            <Link to="/pms/wizard">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 glow-white text-lg px-10 py-6 rounded-xl font-semibold group"
              >
                Get My Free Report First
                <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default LpFounder;
