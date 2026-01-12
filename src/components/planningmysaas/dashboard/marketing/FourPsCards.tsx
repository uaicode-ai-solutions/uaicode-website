import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, DollarSign, MapPin, Megaphone } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { InfoTooltip } from "@/components/ui/info-tooltip";
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

const FourPsCards = () => {
  const fourPsAnalysis = competitorAnalysisData.fourPs;

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

  return (
    <section className="space-y-4">
      {/* Section Header - Compact */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-accent/10">
          <Package className="h-4 w-4 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          4Ps Competitive Analysis
          <InfoTooltip term="4Ps Framework" size="sm">
            Product, Price, Place, and Promotion — marketing framework to compare competitive positioning.
          </InfoTooltip>
        </h2>
      </div>

      {/* Comparative Table */}
      <Card className="glass-premium border-accent/20 overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/5 hover:bg-accent/5">
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
                  <TableRow key={idx} className="hover:bg-accent/5">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-base border border-accent/20">
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
