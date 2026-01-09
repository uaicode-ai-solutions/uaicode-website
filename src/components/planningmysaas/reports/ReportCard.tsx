import { useNavigate } from "react-router-dom";
import { Calendar, Download, MoreVertical, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StoredReport, getProjectDisplayName, getIndustryDisplayName } from "@/lib/reportsStorage";

interface ReportCardProps {
  report: StoredReport;
  onDelete: (id: string) => void;
}

const ReportCard = ({ report, onDelete }: ReportCardProps) => {
  const navigate = useNavigate();
  const projectName = getProjectDisplayName(report);
  const industry = getIndustryDisplayName(report);
  const viabilityScore = report.reportData?.viabilityScore || 0;
  
  const formattedDate = new Date(report.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "enterprise": return "default";
      case "pro": return "secondary";
      default: return "outline";
    }
  };

  const handleView = () => {
    navigate(`/planningmysaas/dashboard/${report.id}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-accent/30 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-foreground truncate">
              {projectName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {industry}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="h-4 w-4 mr-2" />
                View Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(report.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${getScoreColor(viabilityScore)}`}>
              {viabilityScore}%
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Viability
            </span>
          </div>
          <Badge variant={getPlanBadgeVariant(report.planType)} className="text-[10px] capitalize">
            {report.planType}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </div>
          <Button 
            size="sm" 
            onClick={handleView}
            className="h-7 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            View Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
