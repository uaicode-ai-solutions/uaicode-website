import { Globe, CheckCircle2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { landingPageData } from "@/lib/dashboardMockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LandingPagePreview = () => {
  const { sections, conversionElements, previewNote } = landingPageData;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><Globe className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-lg font-semibold text-foreground">Landing Page Preview</h2><p className="text-sm text-muted-foreground">Your optimized landing page structure</p></div>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Page Sections</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sections.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold flex-shrink-0">{i + 1}</div>
                <div className="flex-1"><h4 className="font-medium text-foreground">{s.name}</h4><p className="text-sm text-muted-foreground mb-2">{s.description}</p><div className="flex flex-wrap gap-1">{s.keyElements.map((e, j) => <Badge key={j} variant="outline" className="text-xs">{e}</Badge>)}</div></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Conversion Optimization</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">{conversionElements.map((e, i) => <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20"><CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /><span className="text-sm text-foreground">{e}</span></div>)}</div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardContent className="pt-6">
          <div className="text-center"><Globe className="h-12 w-12 text-accent mx-auto mb-4" /><h3 className="text-lg font-semibold text-foreground mb-2">Landing Page Template Included</h3><p className="text-sm text-muted-foreground mb-4">{previewNote}</p><Button className="gap-2"><Download className="h-4 w-4" />Download Landing Page Template</Button></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPagePreview;
