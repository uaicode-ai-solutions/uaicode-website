import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, DollarSign, MapPin, Megaphone } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-accent";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const FourPsCards = () => {
  const fourPsAnalysis = competitorAnalysisData.fourPs;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Package className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            4Ps Competitive Analysis
            <InfoTooltip term="4Ps Framework">
              Product, Price, Place, and Promotion — a classic marketing framework to analyze and compare competitive positioning across key dimensions.
            </InfoTooltip>
          </h2>
          <p className="text-sm text-muted-foreground">Product, Price, Place, and Promotion comparison</p>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="space-y-4">
        {fourPsAnalysis.map((competitor, idx) => (
          <Card key={idx} className="glass-premium border-accent/20 overflow-hidden">
            <CardHeader className="bg-accent/5 border-b border-accent/10 py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-xl border border-accent/20">
                  {competitor.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base">{competitor.competitor}</CardTitle>
                  <p className="text-xs text-muted-foreground truncate">{competitor.product.differentiators.slice(0, 2).join(" • ")}</p>
                </div>
                {/* Overall Scores - More compact */}
                <div className="hidden md:flex items-center gap-3">
                  {Object.entries({
                    Product: competitor.product.score,
                    Price: competitor.price.score,
                    Place: competitor.place.score,
                    Promotion: competitor.promotion.score,
                  }).map(([label, score]) => (
                    <div key={label} className="text-center">
                      <span className={`text-base font-bold ${getScoreColor(score)}`}>{score}</span>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Product Card */}
                <Card className="border-accent/10 bg-accent/5">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium text-xs">Product</span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(competitor.product.score)}`}>
                        {competitor.product.score}
                      </span>
                    </div>
                    <Progress value={competitor.product.score} className="h-1 [&>div]:bg-accent" />
                    <div className="space-y-1 text-[10px]">
                      <div>
                        <span className="text-muted-foreground">Quality:</span>
                        <span className="ml-1 text-foreground">{competitor.product.quality}</span>
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {competitor.product.features.slice(0, 2).map((f, i) => (
                          <Badge key={i} variant="secondary" className="text-[8px] px-1 py-0 bg-accent/10 text-accent border-accent/20">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Price Card */}
                <Card className="border-accent/10 bg-accent/5">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium text-xs">Price</span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(competitor.price.score)}`}>
                        {competitor.price.score}
                      </span>
                    </div>
                    <Progress value={competitor.price.score} className="h-1 [&>div]:bg-accent" />
                    <div className="space-y-1 text-[10px]">
                      <div>
                        <span className="text-muted-foreground">Range:</span>
                        <span className="ml-1 text-foreground font-medium">{competitor.price.range}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Model:</span>
                        <span className="ml-1 text-foreground">{competitor.price.model}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Place Card */}
                <Card className="border-accent/10 bg-accent/5">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium text-xs">Place</span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(competitor.place.score)}`}>
                        {competitor.place.score}
                      </span>
                    </div>
                    <Progress value={competitor.place.score} className="h-1 [&>div]:bg-accent" />
                    <div className="space-y-1 text-[10px]">
                      <div>
                        <span className="text-muted-foreground">Digital:</span>
                        <span className="ml-1 text-foreground">{competitor.place.digitalPresence}%</span>
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {competitor.place.channels.slice(0, 2).map((c, i) => (
                          <Badge key={i} variant="outline" className="text-[8px] px-1 py-0 border-accent/20 text-accent">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Promotion Card */}
                <Card className="border-accent/10 bg-accent/5">
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Megaphone className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium text-xs">Promotion</span>
                      </div>
                      <span className={`text-sm font-bold ${getScoreColor(competitor.promotion.score)}`}>
                        {competitor.promotion.score}
                      </span>
                    </div>
                    <Progress value={competitor.promotion.score} className="h-1 [&>div]:bg-accent" />
                    <div className="space-y-1 text-[10px]">
                      <div>
                        <span className="text-muted-foreground">Ad Spend:</span>
                        <span className="ml-1 text-foreground">{competitor.promotion.estimatedAdSpend}</span>
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {competitor.promotion.channels.slice(0, 2).map((c, i) => (
                          <Badge key={i} variant="outline" className="text-[8px] px-1 py-0 border-accent/20 text-accent">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FourPsCards;
