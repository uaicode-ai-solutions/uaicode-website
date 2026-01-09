import { Image, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logoSuggestions, mockupPreviews } from "@/lib/dashboardMockData";
import { Button } from "@/components/ui/button";

const LogosSuggestions = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-accent/10"><Image className="h-5 w-5 text-accent" /></div>
      <div><h2 className="text-2xl font-bold text-foreground">Logo Suggestions</h2><p className="text-muted-foreground">Logo variants and brand mockups</p></div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {logoSuggestions.map((l, i) => (
        <Card key={i} className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="aspect-square rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: l.colors.text ? "#1a1a2e" : l.colors.icon }}>
              <div className="text-center"><div className="text-3xl font-bold" style={{ color: l.colors.icon }}>SF</div>{l.colors.text && <div className="text-sm font-medium" style={{ color: l.colors.text }}>SalesFlow</div>}</div>
            </div>
            <h3 className="font-semibold text-foreground">{l.variant}</h3>
            <p className="text-sm text-muted-foreground">{l.description}</p>
            <p className="text-xs text-accent mt-2">{l.usage}</p>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="bg-card/50 border-border/50">
      <CardHeader><CardTitle className="text-lg">Brand Mockups</CardTitle></CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockupPreviews.map((m, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg mb-3 flex items-center justify-center"><Image className="h-8 w-8 text-accent/50" /></div>
              <h4 className="font-medium text-foreground">{m.type}</h4>
              <p className="text-sm text-muted-foreground">{m.description}</p>
              <p className="text-xs text-accent mt-1">{m.specs}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center"><Button className="gap-2"><Download className="h-4 w-4" />Download All Assets</Button></div>
      </CardContent>
    </Card>
  </div>
);

export default LogosSuggestions;
