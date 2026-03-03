import LpHero from "@/components/pms/lp01/LpHero";
import LpProblem from "@/components/pms/lp01/LpProblem";
import LpSolution from "@/components/pms/lp01/LpSolution";
import LpHowItWorks from "@/components/pms/lp01/LpHowItWorks";
import LpFounder from "@/components/pms/lp01/LpFounder";

const PmsLandingPage01 = () => (
  <div className="min-h-screen bg-background text-foreground relative overflow-hidden noise-overlay">
    {/* Mesh gradient background */}
    <div className="absolute inset-0 mesh-gradient pointer-events-none" />

    <div className="relative z-10">
      <LpHero />
      <LpProblem />
      <LpSolution />
      <LpHowItWorks />
      <LpFounder />
    </div>
  </div>
);

export default PmsLandingPage01;
