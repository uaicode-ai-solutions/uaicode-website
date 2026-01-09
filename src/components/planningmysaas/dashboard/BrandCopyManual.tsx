import { MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brandCopyManual } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const BrandCopyManual = () => {
  const { brandName, voiceTone, taglines, valueProposition, elevatorPitch, keyMessages, ctaExamples, emailSubjectLines } = brandCopyManual;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><MessageSquare className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-2xl font-bold text-foreground">Brand Copy Manual</h2><p className="text-muted-foreground">Voice, tone, and messaging guidelines for {brandName}</p></div>
      </div>
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-2">Value Proposition</h3>
          <p className="text-lg text-foreground/90">{valueProposition}</p>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg">Voice & Tone</CardTitle></CardHeader>
          <CardContent>
            <p className="text-accent font-medium mb-4">{voiceTone.primary}</p>
            <div className="flex flex-wrap gap-2 mb-4">{voiceTone.characteristics.map((c, i) => <Badge key={i} variant="outline">{c.trait}</Badge>)}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><h4 className="text-sm font-medium text-green-500 flex items-center gap-1 mb-2"><CheckCircle2 className="h-4 w-4" />Do</h4><ul className="text-sm space-y-1">{voiceTone.doList.map((d, i) => <li key={i} className="text-foreground/80">• {d}</li>)}</ul></div>
              <div><h4 className="text-sm font-medium text-red-500 flex items-center gap-1 mb-2"><XCircle className="h-4 w-4" />Don't</h4><ul className="text-sm space-y-1">{voiceTone.dontList.map((d, i) => <li key={i} className="text-foreground/80">• {d}</li>)}</ul></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg">Taglines</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {taglines.map((t, i) => <div key={i} className="p-3 rounded-lg bg-muted/20"><div className="text-lg font-semibold text-foreground">"{t.tagline}"</div><div className="text-xs text-muted-foreground mt-1">{t.usage}</div></div>)}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Elevator Pitch</CardTitle></CardHeader>
        <CardContent><p className="text-foreground/90 italic">"{elevatorPitch}"</p></CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Key Messages by Audience</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {keyMessages.map((m, i) => <div key={i} className="p-4 rounded-lg bg-muted/20"><div className="flex items-center justify-between mb-2"><Badge>{m.audience}</Badge><span className="text-xs text-green-500">{m.proof}</span></div><p className="text-foreground">{m.message}</p></div>)}
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg">CTA Examples</CardTitle></CardHeader>
          <CardContent className="space-y-2">{ctaExamples.map((c, i) => <div key={i} className="flex items-center justify-between p-2 rounded bg-accent/10"><span className="font-medium text-accent">{c.cta}</span><span className="text-xs text-muted-foreground">{c.context}</span></div>)}</CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg">Email Subject Lines</CardTitle></CardHeader>
          <CardContent className="space-y-2">{emailSubjectLines.map((s, i) => <div key={i} className="p-2 rounded bg-muted/20 text-foreground">"{s}"</div>)}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandCopyManual;
