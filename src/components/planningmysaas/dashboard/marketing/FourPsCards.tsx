import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, DollarSign, MapPin, Megaphone } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompetitorFromDB {
  company_name?: string;
  company_website?: string;
  saas_app_name?: string;
  saas_app_price_range?: string;
  saas_app_pricing_type?: string;
  saas_app_features?: string[];
  saas_app_strengths?: string[];
  saas_app_weakness?: string[];
  saas_app_positioning?: string;
  calculated_score?: number;
}

interface CompetitiveAnalysisFromDB {
  competitors?: Record<string, CompetitorFromDB>;
  average_pricing_range?: string;
  common_features?: string[];
  market_gaps_identified?: string[];
  market_saturation_level?: string;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-accent";
  if (score >= 60) return "text-yellow-500";
  return "text-red-400";
};

const getScoreBg = (score: number): string => {
  if (score >= 80) return "[&>div]:bg-accent";
  if (score >= 60) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-red-400";
};

// Calculate 4Ps scores from competitor data
const calculate4PsFromCompetitor = (competitor: CompetitorFromDB) => {
  const baseScore = competitor.calculated_score || 70;
  const features = competitor.saas_app_features || [];
  const strengths = competitor.saas_app_strengths || [];
  const weaknesses = competitor.saas_app_weakness || [];
  
  // Product score: based on features and strengths
  const productScore = Math.min(95, Math.max(40, 
    baseScore + (features.length * 2) - (weaknesses.length * 3)
  ));
  
  // Price score: based on pricing type and competitive position
  const priceScore = Math.min(90, Math.max(45, 
    competitor.saas_app_pricing_type === 'freemium' ? baseScore + 10 : baseScore
  ));
  
  // Place score: estimate based on company presence
  const placeScore = Math.min(85, Math.max(50, baseScore - 5));
  
  // Promotion score: estimate based on strengths
  const promotionScore = Math.min(80, Math.max(45, 
    baseScore - 10 + (strengths.length * 2)
  ));
  
  return {
    product: {
      score: productScore,
      quality: features.length > 4 ? "High" : features.length > 2 ? "Medium" : "Basic",
      features: features.slice(0, 3),
    },
    price: {
      score: priceScore,
      range: competitor.saas_app_price_range || "...",
      model: competitor.saas_app_pricing_type || "...",
    },
    place: {
      score: placeScore,
      digitalPresence: placeScore,
      channels: ["Web App", "Mobile"],
    },
    promotion: {
      score: promotionScore,
      estimatedAdSpend: promotionScore > 70 ? "High" : promotionScore > 50 ? "Medium" : "Low",
      channels: ["SEO", "Content"],
    },
  };
};

const FourPsCards = () => {
  const { reportData } = useReportContext();
  
  const competitiveData = parseJsonField<CompetitiveAnalysisFromDB | null>(
    reportData?.competitive_analysis_section,
    null
  );

  // Transform competitors from DB to 4Ps format
  const fourPsAnalysis = competitiveData?.competitors 
    ? Object.entries(competitiveData.competitors)
        .slice(0, 5)
        .map(([key, comp]) => {
          const fourPs = calculate4PsFromCompetitor(comp);
          return {
            competitor: comp.company_name || comp.saas_app_name || "...",
            logo: (comp.company_name || "?")[0].toUpperCase(),
            ...fourPs,
          };
        })
    : [];

  const hasData = fourPsAnalysis.length > 0;

  const ScoreCell = ({ score, details }: { score: number; details: string[] }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-1 cursor-help">
            <div className="flex items-center justify-between">
              <Progress value={score} className={`w-16 h-1.5 ${getScoreBg(score)}`} />
              <span className={`text-xs font-bold ml-2 ${getScoreColor(score)}`}>{score}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <ul className="text-xs space-y-1">
            {details.map((d, i) => (
              <li key={i}>• {d}</li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (!hasData) {
    return (
      <section className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Package className="h-5 w-5 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">4Ps Competitive Analysis</h2>
              <InfoTooltip term="4Ps Framework" size="sm">
                Product, Price, Place, and Promotion — marketing framework to compare competitive positioning.
              </InfoTooltip>
            </div>
            <p className="text-sm text-muted-foreground">Competitor positioning across key dimensions</p>
          </div>
        </div>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Competitor analysis data pending...</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Package className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">4Ps Competitive Analysis</h2>
            <InfoTooltip term="4Ps Framework" size="sm">
              Product, Price, Place, and Promotion — marketing framework to compare competitive positioning.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Competitor positioning across key dimensions</p>
        </div>
      </div>

      {/* Comparative Table */}
      <Card className="bg-card/50 border-border/30 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-[180px] text-foreground font-semibold text-xs">Competitor</TableHead>
                <TableHead className="text-center text-xs">
                  <div className="flex items-center justify-center gap-1">
                    <Package className="h-3 w-3 text-accent" />
                    Product
                  </div>
                </TableHead>
                <TableHead className="text-center text-xs">
                  <div className="flex items-center justify-center gap-1">
                    <DollarSign className="h-3 w-3 text-accent" />
                    Price
                  </div>
                </TableHead>
                <TableHead className="text-center text-xs">
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3 text-accent" />
                    Place
                  </div>
                </TableHead>
                <TableHead className="text-center text-xs">
                  <div className="flex items-center justify-center gap-1">
                    <Megaphone className="h-3 w-3 text-accent" />
                    Promotion
                  </div>
                </TableHead>
                <TableHead className="text-center text-xs text-foreground font-semibold">Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fourPsAnalysis.map((competitor, idx) => {
                const avgScore = Math.round(
                  (competitor.product.score + competitor.price.score + competitor.place.score + competitor.promotion.score) / 4
                );
                return (
                  <TableRow key={idx} className="hover:bg-muted/10">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-muted/10 flex items-center justify-center text-base border border-border/20">
                          {competitor.logo}
                        </div>
                        <div>
                          <span className="font-medium text-foreground text-sm">{competitor.competitor}</span>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                            {competitor.price.range}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ScoreCell 
                        score={competitor.product.score} 
                        details={[
                          `Quality: ${competitor.product.quality}`,
                          ...competitor.product.features.slice(0, 2)
                        ]} 
                      />
                    </TableCell>
                    <TableCell>
                      <ScoreCell 
                        score={competitor.price.score} 
                        details={[
                          `Range: ${competitor.price.range}`,
                          `Model: ${competitor.price.model}`
                        ]} 
                      />
                    </TableCell>
                    <TableCell>
                      <ScoreCell 
                        score={competitor.place.score} 
                        details={[
                          `Digital: ${competitor.place.digitalPresence}%`,
                          ...competitor.place.channels.slice(0, 2)
                        ]} 
                      />
                    </TableCell>
                    <TableCell>
                      <ScoreCell 
                        score={competitor.promotion.score} 
                        details={[
                          `Ad Spend: ${competitor.promotion.estimatedAdSpend}`,
                          ...competitor.promotion.channels.slice(0, 2)
                        ]} 
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={`${getScoreColor(avgScore)} border-current text-xs font-bold`}
                      >
                        {avgScore}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span>Strong (80+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Medium (60-79)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span>Weak (&lt;60)</span>
        </div>
      </div>
    </section>
  );
};

export default FourPsCards;