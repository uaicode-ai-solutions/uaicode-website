import { Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brandIdentityManual } from "@/lib/dashboardMockData";

const BrandIdentityManual = () => {
  const { colorPalette, typography, logoUsage, spacing, borderRadius } = brandIdentityManual;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><Palette className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-lg font-semibold text-foreground">Brand Identity Manual</h2><p className="text-sm text-muted-foreground">Visual guidelines and design system</p></div>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Color Palette</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2"><div className="h-20 rounded-lg" style={{ backgroundColor: colorPalette.primary.hex }} /><div className="text-sm font-medium text-foreground">{colorPalette.primary.name}</div><div className="text-xs text-muted-foreground">{colorPalette.primary.hex}</div></div>
            <div className="space-y-2"><div className="h-20 rounded-lg" style={{ backgroundColor: colorPalette.secondary.hex }} /><div className="text-sm font-medium text-foreground">{colorPalette.secondary.name}</div><div className="text-xs text-muted-foreground">{colorPalette.secondary.hex}</div></div>
            <div className="space-y-2"><div className="h-20 rounded-lg" style={{ backgroundColor: colorPalette.accent.hex }} /><div className="text-sm font-medium text-foreground">{colorPalette.accent.name}</div><div className="text-xs text-muted-foreground">{colorPalette.accent.hex}</div></div>
            <div className="space-y-2"><div className="h-20 rounded-lg" style={{ backgroundColor: colorPalette.success.hex }} /><div className="text-sm font-medium text-foreground">{colorPalette.success.name}</div><div className="text-xs text-muted-foreground">{colorPalette.success.hex}</div></div>
            <div className="space-y-2"><div className="h-20 rounded-lg" style={{ backgroundColor: colorPalette.warning.hex }} /><div className="text-sm font-medium text-foreground">{colorPalette.warning.name}</div><div className="text-xs text-muted-foreground">{colorPalette.warning.hex}</div></div>
            <div className="space-y-2"><div className="h-20 rounded-lg" style={{ backgroundColor: colorPalette.error.hex }} /><div className="text-sm font-medium text-foreground">{colorPalette.error.name}</div><div className="text-xs text-muted-foreground">{colorPalette.error.hex}</div></div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Typography</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/20"><div className="text-xs text-muted-foreground mb-1">Headings</div><div className="text-2xl font-bold text-foreground">{typography.headings.font}</div><div className="text-xs text-muted-foreground">{typography.headings.weight}</div></div>
              <div className="p-4 rounded-lg bg-muted/20"><div className="text-xs text-muted-foreground mb-1">Body</div><div className="text-xl text-foreground">{typography.body.font}</div><div className="text-xs text-muted-foreground">{typography.body.weight}</div></div>
              <div className="p-4 rounded-lg bg-muted/20"><div className="text-xs text-muted-foreground mb-1">Mono</div><div className="text-xl font-mono text-foreground">{typography.mono.font}</div><div className="text-xs text-muted-foreground">{typography.mono.weight}</div></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">{typography.scale.map((s, i) => <div key={i} className="p-2 rounded bg-muted/20 text-center"><div className="text-foreground" style={{ fontSize: s.size }}>{s.name}</div><div className="text-xs text-muted-foreground">{s.size}</div></div>)}</div>
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg">Logo Usage</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded bg-muted/20"><span className="text-muted-foreground">Min Size:</span><span className="ml-2 text-foreground">{logoUsage.minSize}</span></div>
            <div className="p-3 rounded bg-muted/20"><span className="text-muted-foreground">Clear Space:</span><span className="ml-2 text-foreground">{logoUsage.clearSpace}</span></div>
            <div className="p-3 rounded bg-muted/20"><span className="text-muted-foreground">Backgrounds:</span><span className="ml-2 text-foreground">{logoUsage.backgrounds.join(", ")}</span></div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg">Spacing & Radius</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded bg-muted/20"><span className="text-muted-foreground">Base:</span><span className="ml-2 text-foreground">{spacing.base}</span></div>
              <div className="p-3 rounded bg-muted/20"><span className="text-muted-foreground">Container Max:</span><span className="ml-2 text-foreground">{spacing.containerMax}</span></div>
              <div className="flex gap-2 flex-wrap">{Object.entries(borderRadius).map(([k, v]) => <div key={k} className="px-3 py-1 rounded-full bg-accent/10 text-xs"><span className="text-muted-foreground">{k}:</span><span className="ml-1 text-accent">{v}</span></div>)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandIdentityManual;
