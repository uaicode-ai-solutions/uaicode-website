import { Package, DollarSign, MapPin, Megaphone, ChevronDown, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const FourPsAnalysis = () => {
  const { fourPs } = competitorAnalysisData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Marketing Mix Analysis (4Ps)</h3>
          <p className="text-sm text-muted-foreground">Product, Price, Place, and Promotion breakdown for each competitor</p>
        </div>
      </div>

      {/* Competitor Accordions */}
      <Accordion type="multiple" className="space-y-4">
        {fourPs.map((competitor, index) => (
          <AccordionItem 
            key={index} 
            value={`competitor-${index}`}
            className="border border-border/50 rounded-xl overflow-hidden bg-card/50"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-muted/30 hover:no-underline [&[data-state=open]]:bg-muted/30">
              <div className="flex items-center gap-4 w-full">
                <div className="text-3xl">{competitor.logo}</div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-foreground">{competitor.competitor}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-sm font-medium ${getScoreColor(competitor.product.score)}`}>
                        {competitor.product.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-sm font-medium ${getScoreColor(competitor.price.score)}`}>
                        {competitor.price.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-sm font-medium ${getScoreColor(competitor.place.score)}`}>
                        {competitor.place.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Megaphone className="h-3 w-3 text-muted-foreground" />
                      <span className={`text-sm font-medium ${getScoreColor(competitor.promotion.score)}`}>
                        {competitor.promotion.score}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                {/* Product */}
                <Card className="bg-background/50 border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-accent" />
                        Product
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={competitor.product.score} className="w-16 h-2" />
                        <span className={`text-sm font-bold ${getScoreColor(competitor.product.score)}`}>
                          {competitor.product.score}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.product.features.map((f, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Quality</p>
                        <p className="font-medium">{competitor.product.quality}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Support</p>
                        <p className="font-medium">{competitor.product.support}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Differentiators</p>
                      <ul className="space-y-1">
                        {competitor.product.differentiators.map((d, i) => (
                          <li key={i} className="text-sm text-foreground/80 flex items-start gap-1">
                            <Star className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Price */}
                <Card className="bg-background/50 border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Price
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={competitor.price.score} className="w-16 h-2" />
                        <span className={`text-sm font-bold ${getScoreColor(competitor.price.score)}`}>
                          {competitor.price.score}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Model</p>
                        <p className="font-medium">{competitor.price.model}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Range</p>
                        <p className="font-medium text-accent">{competitor.price.range}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Avg. Ticket</p>
                        <p className="font-medium">{competitor.price.averageTicket}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Flexibility</p>
                        <p className="font-medium">{competitor.price.flexibility}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Discounts</p>
                      <p className="text-sm text-foreground/80">{competitor.price.discounts}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Place */}
                <Card className="bg-background/50 border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        Place
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={competitor.place.score} className="w-16 h-2" />
                        <span className={`text-sm font-bold ${getScoreColor(competitor.place.score)}`}>
                          {competitor.place.score}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Channels</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.place.channels.map((c, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Markets</p>
                        <p className="font-medium">{competitor.place.markets.join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Coverage</p>
                        <p className="font-medium">{competitor.place.coverage}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Digital Presence</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={competitor.place.digitalPresence} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{competitor.place.digitalPresence}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Promotion */}
                <Card className="bg-background/50 border-border/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-purple-500" />
                        Promotion
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={competitor.promotion.score} className="w-16 h-2" />
                        <span className={`text-sm font-bold ${getScoreColor(competitor.promotion.score)}`}>
                          {competitor.promotion.score}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Channels</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.promotion.channels.map((c, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Ad Spend</p>
                        <p className="font-medium text-accent">{competitor.promotion.estimatedAdSpend}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Social Followers</p>
                        <p className="font-medium">{competitor.promotion.socialFollowers}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tone</p>
                      <p className="text-sm text-foreground/80 italic">"{competitor.promotion.tone}"</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FourPsAnalysis;
