import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useReportContext } from "@/contexts/ReportContext";
import { HeroScoreSection } from "@/types/report";
import ScoreCircle from "@/components/planningmysaas/dashboard/ui/ScoreCircle";

/**
 * Compact hero for the public shared report page.
 * Shows project name, viability score ring, and tagline.
 */
const SharedReportHero = () => {
  const { report, reportData } = useReportContext();

  const projectName = report?.saas_name || "Business Plan";
  const heroScoreData = reportData?.hero_score_section as HeroScoreSection | null;
  const viabilityScore = heroScoreData?.score ?? 0;
  const tagline = heroScoreData?.tagline || "Viability Analysis";

  return (
    <div className="text-center py-12 space-y-6 animate-fade-in">
      {/* Badge */}
      <Badge variant="outline" className="border-accent/30 text-accent gap-2 px-4 py-1.5">
        <Sparkles className="h-3.5 w-3.5" />
        Shared Business Plan
      </Badge>

      {/* Project Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        {projectName}
      </h1>

      {/* Score Ring */}
      <div className="flex justify-center">
        <ScoreCircle
          score={viabilityScore}
          label="Viability"
          size="2xl"
          showGlow
        />
      </div>

      {/* Tagline */}
      <p className="text-lg text-accent font-medium max-w-md mx-auto">
        {tagline}
      </p>
    </div>
  );
};

export default SharedReportHero;
