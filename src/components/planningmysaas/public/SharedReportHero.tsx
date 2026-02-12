import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useReportContext } from "@/contexts/ReportContext";
import ScoreCircle from "@/components/planningmysaas/dashboard/ui/ScoreCircle";
import { HeroScoreSection, safeNumber } from "@/types/report";

/**
 * Compact premium banner for the public shared report page.
 * Displays project name, viability score, and verdict tagline.
 */
const SharedReportHero = () => {
  const { report, reportData } = useReportContext();

  // Project name
  const projectName = report?.saas_name || "Business Plan";

  // Score and tagline from hero_score_section
  const heroScoreData = reportData?.hero_score_section as HeroScoreSection | null;
  const viabilityScore = safeNumber(heroScoreData?.score, 0);
  const tagline = heroScoreData?.tagline || "Viability Analysis";

  return (
    <div className="relative py-8 md:py-10 px-6 md:px-8 rounded-xl overflow-hidden mb-8">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      
      {/* Badge - positioned top right */}
      <Badge 
        variant="outline" 
        className="absolute top-4 right-4 border-accent/30 text-accent gap-1.5 px-3 py-1"
      >
        <Sparkles className="h-3 w-3" />
        Shared Business Plan
      </Badge>

      {/* Content - horizontal layout */}
      <div className="relative z-10 flex items-center gap-6">
        {/* Score Ring */}
        <ScoreCircle 
          score={viabilityScore} 
          label="Viability" 
          size="xl" 
          showGlow 
        />
        
        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
            {projectName}
          </h1>
          <p className="text-accent mt-1 text-sm md:text-base line-clamp-2">
            {tagline}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedReportHero;
