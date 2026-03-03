import { useEffect } from "react";
import LpHero from "@/components/pms/lp01/LpHero";
import LpProblem from "@/components/pms/lp01/LpProblem";
import LpSolution from "@/components/pms/lp01/LpSolution";
import LpHowItWorks from "@/components/pms/lp01/LpHowItWorks";
import SuccessCases from "@/components/SuccessCases";
import LpFooter from "@/components/pms/lp01/LpFooter";

const PmsLandingPage01 = () => {
  useEffect(() => {
    document.title = "Free SaaS Validation Report | Uaicode.ai";

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name.startsWith("og:")) {
          el.setAttribute("property", name);
        } else {
          el.setAttribute("name", name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const desc = "Turn your SaaS idea into a data-driven strategy in minutes. Get a free market validation report with competitive analysis, financial projections, and more.";
    setMeta("description", desc);
    setMeta("og:title", "Free SaaS Validation Report | Uaicode.ai");
    setMeta("og:description", desc);
    setMeta("og:type", "website");
    setMeta("og:image", "https://uaicodewebsite.lovable.app/og-image.png");

    return () => {
      document.title = "Uaicode";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden noise-overlay">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background pointer-events-none" />
      <div className="relative z-10">
        <LpHero />
        <LpProblem />
        <LpSolution />
        <SuccessCases showCTAs={false} />
        <LpHowItWorks />
        <LpFooter />
      </div>
    </div>
  );
};

export default PmsLandingPage01;
