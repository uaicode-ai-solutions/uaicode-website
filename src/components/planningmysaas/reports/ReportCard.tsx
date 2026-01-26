import { useNavigate } from "react-router-dom";
import { MoreVertical, Trash2, Eye, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportRow } from "@/types/report";
import { format } from "date-fns";

interface ReportCardProps {
  report: ReportRow;
  onDelete: (id: string) => void;
}

const ReportCard = ({ report, onDelete }: ReportCardProps) => {
  const navigate = useNavigate();
  
  // Extract nested report data (first item from JOIN)
  const reportData = report.tb_pms_reports?.[0];
  
  // Basic info from wizard
  const projectName = report.saas_name || "Untitled Project";
  const industry = report.industry_other || report.industry || "Technology";
  const formattedDate = format(new Date(report.created_at), "MMM dd, yyyy");
  
  // Real viability score from hero_score_section
  const viabilityScore = reportData?.hero_score_section?.score ?? 0;
  
  // Verdict from summary_section
  const verdict = reportData?.summary_section?.verdict || null;
  
  // TAM from opportunity_section
  const tamValue = reportData?.opportunity_section?.tam_value || null;
  
  // Check if report is still generating
  const isGenerating = !reportData || reportData.status?.toLowerCase().includes("pending");
  const handleView = () => {
    navigate(`/planningmysaas/dashboard/${report.id}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-amber-400";
    if (score >= 60) return "text-amber-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300";
    if (score >= 60) return "bg-gradient-to-r from-amber-600 to-amber-400";
    if (score >= 40) return "bg-gradient-to-r from-orange-500 to-orange-400";
    return "bg-gradient-to-r from-red-500 to-red-400";
  };
  // Get verdict badge color
  const getVerdictStyle = (v: string | null) => {
    if (!v) return null;
    const lower = v.toLowerCase();
    if (lower.includes("proceed") || lower.includes("strong")) {
      return { bg: "bg-green-500/20", text: "text-green-400", label: "Proceed" };
    }
    if (lower.includes("caution") || lower.includes("conditional")) {
      return { bg: "bg-amber-500/20", text: "text-amber-400", label: "Caution" };
    }
    if (lower.includes("stop") || lower.includes("pivot")) {
      return { bg: "bg-red-500/20", text: "text-red-400", label: "Reconsider" };
    }
    return { bg: "bg-muted/50", text: "text-muted-foreground", label: "Analyzing" };
  };

  const verdictStyle = getVerdictStyle(verdict);

  return (
    <Card className="group relative overflow-hidden glass-premium border-accent/10 
      hover:border-accent/30 transition-all duration-500 
      hover:shadow-[0_0_40px_hsla(45,100%,55%,0.12)]
      hover:-translate-y-1">
      
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <CardContent className="relative p-6">
        {/* Header with badge and menu */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-foreground truncate leading-tight">
                {projectName}
              </h3>
              {isGenerating && (
                <Loader2 className="h-4 w-4 text-accent animate-spin shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {industry}
            </p>
          </div>
          
          {/* Menu - appears on hover */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300
                  hover:bg-accent/10 rounded-full shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-premium border-accent/20">
              <DropdownMenuItem onClick={handleView} className="cursor-pointer">
                <Eye className="h-4 w-4 mr-2" />
                View Report
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(report.id)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Score with premium visual */}
        <div className="mb-5">
          {isGenerating ? (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-muted-foreground text-sm">Generating report...</span>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2 mb-3">
                <span className={`text-4xl font-bold ${getScoreColor(viabilityScore)} leading-none`}>
                  {viabilityScore}
                </span>
                <span className="text-lg text-muted-foreground mb-0.5">/ 100</span>
              </div>
              {/* Progress bar premium */}
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBarColor(viabilityScore)}`}
                  style={{ width: `${viabilityScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">Viability Score</p>
                {verdictStyle && (
                  <Badge className={`${verdictStyle.bg} ${verdictStyle.text} border-0 text-xs`}>
                    {verdictStyle.label}
                  </Badge>
                )}
              </div>
              {tamValue && (
                <p className="text-xs text-muted-foreground mt-2">
                  TAM: <span className="text-foreground font-medium">{tamValue}</span>
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer premium */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
          <Button 
            size="sm" 
            onClick={handleView}
            className="bg-accent hover:bg-accent/90 text-background font-medium 
              shadow-lg shadow-accent/20 hover:shadow-accent/30
              transition-all duration-300 group/btn"
          >
            View
            <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
