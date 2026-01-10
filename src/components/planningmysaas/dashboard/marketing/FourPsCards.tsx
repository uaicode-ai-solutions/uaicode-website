import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package, DollarSign, MapPin, Megaphone } from "lucide-react";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const getScoreBg = (score: number): string => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const FourPsCards = () => {
  const fourPsAnalysis = competitorAnalysisData.fourPs;

  const pIcons = {
    product: Package,
    price: DollarSign,
    place: MapPin,
    promotion: Megaphone,
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">4Ps Competitive Analysis</h2>
          <p className="text-muted-foreground">Product, Price, Place, and Promotion comparison across competitors</p>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="space-y-8">
        {fourPsAnalysis.map((competitor, idx) => (
          <Card key={idx} className="border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl border border-border/50">
                  {competitor.logo}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{competitor.competitor}</CardTitle>
                  <p className="text-sm text-muted-foreground">{competitor.product.differentiators.join(" • ")}</p>
                </div>
                {/* Overall Scores */}
                <div className="hidden md:flex items-center gap-4">
                  {Object.entries({
                    Product: competitor.product.score,
                    Price: competitor.price.score,
                    Place: competitor.place.score,
                    Promotion: competitor.promotion.score,
                  }).map(([label, score]) => (
                    <div key={label} className="text-center">
                      <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Product Card */}
                <Card className="border-border/30 bg-background/50">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Product</span>
                      </div>
                      <span className={`text-lg font-bold ${getScoreColor(competitor.product.score)}`}>
                        {competitor.product.score}
                      </span>
                    </div>
                    <Progress value={competitor.product.score} className={`h-1.5 ${getScoreBg(competitor.product.score)}`} />
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Quality:</span>
                        <span className="ml-1 text-foreground">{competitor.product.quality}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Support:</span>
                        <span className="ml-1 text-foreground">{competitor.product.support}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {competitor.product.features.slice(0, 3).map((f, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Price Card */}
                <Card className="border-border/30 bg-background/50">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-sm">Price</span>
                      </div>
                      <span className={`text-lg font-bold ${getScoreColor(competitor.price.score)}`}>
                        {competitor.price.score}
                      </span>
                    </div>
                    <Progress value={competitor.price.score} className={`h-1.5 ${getScoreBg(competitor.price.score)}`} />
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Model:</span>
                        <span className="ml-1 text-foreground">{competitor.price.model}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Range:</span>
                        <span className="ml-1 text-foreground font-medium">{competitor.price.range}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Ticket:</span>
                        <span className="ml-1 text-foreground">{competitor.price.averageTicket}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Place Card */}
                <Card className="border-border/30 bg-background/50">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-sm">Place</span>
                      </div>
                      <span className={`text-lg font-bold ${getScoreColor(competitor.place.score)}`}>
                        {competitor.place.score}
                      </span>
                    </div>
                    <Progress value={competitor.place.score} className={`h-1.5 ${getScoreBg(competitor.place.score)}`} />
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Digital:</span>
                        <span className="ml-1 text-foreground">{competitor.place.digitalPresence}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Distribution:</span>
                        <span className="ml-1 text-foreground">{competitor.place.distribution}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {competitor.place.channels.slice(0, 2).map((c, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Promotion Card */}
                <Card className="border-border/30 bg-background/50">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-sm">Promotion</span>
                      </div>
                      <span className={`text-lg font-bold ${getScoreColor(competitor.promotion.score)}`}>
                        {competitor.promotion.score}
                      </span>
                    </div>
                    <Progress value={competitor.promotion.score} className={`h-1.5 ${getScoreBg(competitor.promotion.score)}`} />
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Ad Spend:</span>
                        <span className="ml-1 text-foreground">{competitor.promotion.estimatedAdSpend}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tone:</span>
                        <span className="ml-1 text-foreground">{competitor.promotion.tone}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {competitor.promotion.channels.slice(0, 2).map((c, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
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
