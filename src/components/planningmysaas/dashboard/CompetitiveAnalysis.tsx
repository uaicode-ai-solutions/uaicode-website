import { Users, ExternalLink, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { competitorsData, yourAdvantages } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const CompetitiveAnalysis = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-accent/10"><Users className="h-5 w-5 text-accent" /></div>
      <div><h2 className="text-2xl font-bold text-foreground">Competitive Analysis</h2><p className="text-muted-foreground">Know your competition</p></div>
    </div>
    <div className="grid gap-4">
      {competitorsData.map((c, i) => (
        <Card key={i} className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div><h3 className="font-semibold text-foreground">{c.name}</h3><a href={c.website} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1">{c.website}<ExternalLink className="h-3 w-3" /></a></div>
              <div className="text-right"><Badge variant="outline">{c.positioning}</Badge><div className="text-sm font-medium text-foreground mt-1">{c.priceRange}</div></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><h4 className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" />Strengths</h4><ul className="space-y-1">{c.strengths.map((s, j) => <li key={j} className="text-sm text-foreground/80">• {s}</li>)}</ul></div>
              <div><h4 className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" />Weaknesses</h4><ul className="space-y-1">{c.weaknesses.map((w, j) => <li key={j} className="text-sm text-foreground/80">• {w}</li>)}</ul></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-accent" />Your Competitive Advantages</CardTitle></CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        {yourAdvantages.map((a, i) => (
          <div key={i} className="p-4 rounded-lg bg-background/50 border border-border/30">
            <h4 className="font-medium text-accent mb-1">{a.advantage}</h4>
            <p className="text-sm text-foreground/80 mb-2">{a.description}</p>
            <p className="text-xs text-muted-foreground italic">Gap: {a.competitorGap}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default CompetitiveAnalysis;
