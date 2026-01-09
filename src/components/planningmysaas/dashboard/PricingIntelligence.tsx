import { DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pricingIntelligenceData } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const PricingIntelligence = () => {
  const { marketAverage, priceRange, pricingModels, recommendedPrice, pricePositioning, priceJustification, freemiumStrategy } = pricingIntelligenceData;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><DollarSign className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-2xl font-bold text-foreground">Market Pricing Intelligence</h2><p className="text-muted-foreground">Optimal pricing strategy</p></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><div className="text-3xl font-bold text-foreground">{marketAverage}</div><div className="text-sm text-muted-foreground mt-1">Market Average</div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><div className="text-xl font-bold text-foreground">{priceRange.min} - {priceRange.max}</div><div className="text-sm text-muted-foreground mt-1">Price Range</div></CardContent></Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30"><CardContent className="pt-6 text-center"><div className="text-3xl font-bold text-accent">{recommendedPrice}</div><div className="text-sm text-muted-foreground mt-1">Recommended Price</div><Badge className="mt-2">{pricePositioning}</Badge></CardContent></Card>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Pricing Models in Market</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">{pricingModels.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1"><div className="flex justify-between text-sm mb-1"><span className="text-foreground">{m.model}</span><span className="text-muted-foreground">{m.percentage}%</span></div><div className="h-2 bg-muted/30 rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${m.percentage}%` }} /></div></div>
              <Badge variant="outline" className="text-xs">{m.trend}</Badge>
            </div>
          ))}</div>
          <p className="text-sm text-muted-foreground mt-4 p-3 bg-muted/20 rounded-lg">{priceJustification}</p>
        </CardContent>
      </Card>
      {freemiumStrategy.recommended && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" />Freemium Strategy Recommended</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-muted/20 rounded-lg"><div className="text-sm text-muted-foreground">Free Tier Limit</div><div className="font-medium text-foreground">{freemiumStrategy.freeLimit}</div></div>
            <div className="p-3 bg-muted/20 rounded-lg"><div className="text-sm text-muted-foreground">Conversion Target</div><div className="font-medium text-foreground">{freemiumStrategy.conversionTarget}</div></div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PricingIntelligence;
