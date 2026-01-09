import { Layout, Monitor, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { screenMockups } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const ScreenMockups = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-accent/10"><Layout className="h-5 w-5 text-accent" /></div>
      <div><h2 className="text-2xl font-bold text-foreground">Screen Mockups</h2><p className="text-muted-foreground">Key screens for your application</p></div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {screenMockups.map((m, i) => (
        <Card key={i} className="bg-card/50 border-border/50 hover:border-accent/30 transition-colors group">
          <CardContent className="pt-6">
            <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg mb-4 flex items-center justify-center border border-border/30 group-hover:border-accent/30 transition-colors">
              {m.category === "Mobile" ? <Smartphone className="h-12 w-12 text-muted-foreground/50" /> : <Monitor className="h-12 w-12 text-muted-foreground/50" />}
            </div>
            <div className="flex items-center justify-between mb-2"><h3 className="font-semibold text-foreground">{m.name}</h3><Badge variant="outline" className="text-xs">{m.category}</Badge></div>
            <p className="text-sm text-muted-foreground mb-3">{m.description}</p>
            <div className="flex flex-wrap gap-1">{m.features.map((f, j) => <span key={j} className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">{f}</span>)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default ScreenMockups;
