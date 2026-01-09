import { DollarSign, Check, X, TrendingDown, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { reportData } from "@/lib/reportMockData";

const InvestmentSection = () => {
  const { investment } = reportData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section id="investment" className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <DollarSign className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">O Investimento</h2>
          <p className="text-sm text-muted-foreground">Quanto custa construir seu MVP</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main Investment Card */}
        <Card className="lg:col-span-3 bg-card/50 border-border/30">
          <CardContent className="p-6">
            {/* Total Investment */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">Investimento Total MVP</p>
              <div className="text-5xl font-bold text-gradient-gold">
                {formatCurrency(investment.total)}
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">Breakdown do Investimento</h3>
              </div>
              
              {investment.breakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-medium">
                        {formatCurrency(item.value)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={item.percentage} 
                    className="h-2 bg-muted/30"
                  />
                </div>
              ))}
            </div>

            {/* Comparison */}
            <div className="mt-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Agência tradicional cobraria{" "}
                    <span className="text-red-400 line-through font-medium">
                      {formatCurrency(investment.comparison.traditional)}
                    </span>
                  </p>
                  <p className="text-green-400 font-medium">
                    Você economiza {investment.comparison.savings} com a Uaicode
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Included / Not Included */}
        <Card className="lg:col-span-2 bg-card/50 border-border/30">
          <CardContent className="p-6 space-y-6">
            {/* Included */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                O que está incluso
              </h3>
              <ul className="space-y-3">
                {investment.included.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30" />

            {/* Not Included */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <X className="h-5 w-5 text-muted-foreground" />
                Não incluso
              </h3>
              <ul className="space-y-3">
                {investment.notIncluded.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Note */}
            <p className="text-xs text-muted-foreground italic">
              * Itens não inclusos podem ser contratados separadamente
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InvestmentSection;
