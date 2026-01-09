import { useState } from "react";
import { 
  Layout, 
  MessageSquare, 
  Palette, 
  Image, 
  Globe,
  Monitor,
  Smartphone,
  Download,
  CheckCircle2,
  Type,
  Copy
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assetsData } from "@/lib/reportMockData";
import { toast } from "sonner";

const BrandAssetsTab = () => {
  const [activeTab, setActiveTab] = useState("mockups");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Brand Assets</h2>
          <p className="text-sm text-muted-foreground">Brand and design deliverables included in the project</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Download className="h-4 w-4" />
          Download All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-card/50 border border-border/30">
          <TabsTrigger value="mockups" className="gap-2 text-xs md:text-sm">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Mockups</span>
          </TabsTrigger>
          <TabsTrigger value="copy" className="gap-2 text-xs md:text-sm">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Copy</span>
          </TabsTrigger>
          <TabsTrigger value="identity" className="gap-2 text-xs md:text-sm">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Identity</span>
          </TabsTrigger>
          <TabsTrigger value="logos" className="gap-2 text-xs md:text-sm">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Logos</span>
          </TabsTrigger>
          <TabsTrigger value="landing" className="gap-2 text-xs md:text-sm">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Landing</span>
          </TabsTrigger>
        </TabsList>

        {/* Screen Mockups */}
        <TabsContent value="mockups" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {assetsData.screenMockups.map((mockup, index) => (
              <Card key={index} className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors group overflow-hidden">
                <CardContent className="p-0">
                  {/* Preview Area */}
                  <div className="aspect-video bg-gradient-to-br from-muted/30 via-muted/10 to-transparent relative">
                    <div className="absolute inset-3 rounded-md border border-border/50 bg-background/50 flex items-center justify-center">
                      {mockup.category === "Mobile" ? (
                        <Smartphone className="h-8 w-8 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
                      ) : (
                        <Monitor className="h-8 w-8 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`absolute top-2 right-2 text-[10px] ${
                        mockup.priority === 'Core' 
                          ? 'border-accent/50 text-accent' 
                          : 'border-border/50'
                      }`}
                    >
                      {mockup.priority}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm text-foreground">{mockup.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{mockup.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{mockup.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {mockup.features.slice(0, 3).map((feature, idx) => (
                        <span 
                          key={idx} 
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20"
                        >
                          {feature}
                        </span>
                      ))}
                      {mockup.features.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                          +{mockup.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Brand Copy */}
        <TabsContent value="copy" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Value Proposition */}
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Value Proposition</h3>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 relative group">
                  <p className="text-foreground">{assetsData.brandCopy.valueProposition}</p>
                  <button 
                    onClick={() => copyToClipboard(assetsData.brandCopy.valueProposition)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Voice & Tone */}
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Voice & Tone</h3>
                <Badge variant="outline" className="mb-4 border-accent/30 text-accent">
                  {assetsData.brandCopy.voiceTone.primary}
                </Badge>
                <div className="grid grid-cols-2 gap-3">
                  {assetsData.brandCopy.voiceTone.characteristics.map((char, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-muted/20 border border-border/30">
                      <p className="font-medium text-sm text-foreground">{char.trait}</p>
                      <p className="text-xs text-muted-foreground mt-1">{char.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Taglines */}
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Taglines</h3>
                <div className="space-y-3">
                  {assetsData.brandCopy.taglines.map((tagline, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 group">
                      <div>
                        <p className="font-medium text-foreground">"{tagline.text}"</p>
                        <p className="text-xs text-muted-foreground mt-1">{tagline.usage} • {tagline.context}</p>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(tagline.text)}
                        className="p-1.5 rounded bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Elevator Pitch */}
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Elevator Pitch</h3>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30 relative group">
                  <p className="text-sm text-foreground/90 leading-relaxed">{assetsData.brandCopy.elevatorPitch}</p>
                  <button 
                    onClick={() => copyToClipboard(assetsData.brandCopy.elevatorPitch)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTAs */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">CTA Examples</h3>
              <div className="flex flex-wrap gap-3">
                {assetsData.brandCopy.ctaExamples.map((cta, idx) => (
                  <div 
                    key={idx} 
                    className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors cursor-pointer group"
                    onClick={() => copyToClipboard(cta.cta)}
                  >
                    <span className="font-medium text-foreground">{cta.cta}</span>
                    <span className="text-xs text-muted-foreground ml-2">({cta.context})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brand Identity */}
        <TabsContent value="identity" className="mt-6 space-y-6">
          {/* Color Palette */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Palette className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">Color Palette</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {assetsData.brandIdentity.colorPalette.map((color, idx) => (
                  <div 
                    key={idx} 
                    className="group cursor-pointer"
                    onClick={() => copyToClipboard(color.hex)}
                  >
                    <div 
                      className="aspect-square rounded-lg mb-2 border border-border/30 flex items-end p-2"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className="text-[10px] font-mono bg-black/50 px-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {color.hex}
                      </span>
                    </div>
                    <p className="font-medium text-sm text-foreground">{color.name}</p>
                    <p className="text-xs text-muted-foreground">{color.usage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Type className="h-5 w-5 text-accent" />
                <h3 className="font-semibold text-foreground">Typography</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-2">Headings</p>
                  <p className="text-2xl font-bold">{assetsData.brandIdentity.typography.headings.font}</p>
                  <p className="text-xs text-muted-foreground">Weight: {assetsData.brandIdentity.typography.headings.weight}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-2">Body</p>
                  <p className="text-2xl">{assetsData.brandIdentity.typography.body.font}</p>
                  <p className="text-xs text-muted-foreground">Weight: {assetsData.brandIdentity.typography.body.weight}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                  <p className="text-sm text-muted-foreground mb-2">Accent</p>
                  <p className="text-2xl font-semibold">{assetsData.brandIdentity.typography.accent.font}</p>
                  <p className="text-xs text-muted-foreground">Weight: {assetsData.brandIdentity.typography.accent.weight}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {assetsData.brandIdentity.typography.scale.map((item, idx) => (
                  <div key={idx} className="text-center p-3 rounded-lg bg-muted/10 border border-border/20">
                    <p style={{ fontSize: item.size }} className="font-semibold truncate">Aa</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground/70">{item.size}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Spacing & Radius */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Spacing Scale</h3>
                <div className="flex flex-wrap gap-2">
                  {assetsData.brandIdentity.spacing.scale.map((space, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded bg-muted/20 border border-border/30">
                      <div 
                        className="bg-accent h-4" 
                        style={{ width: space }}
                      />
                      <span className="text-xs font-mono text-muted-foreground">{space}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/30">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Border Radius</h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(assetsData.brandIdentity.borderRadius).map(([key, value], idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-12 h-12 bg-accent/20 border-2 border-accent"
                        style={{ borderRadius: value }}
                      />
                      <span className="text-xs text-muted-foreground capitalize">{key}</span>
                      <span className="text-[10px] font-mono text-muted-foreground/70">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logo Suggestions */}
        <TabsContent value="logos" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assetsData.logos.map((logo, index) => (
              <Card key={index} className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors overflow-hidden">
                <CardContent className="p-0">
                  {/* Logo Preview */}
                  <div 
                    className={`aspect-square flex items-center justify-center p-8 ${
                      logo.preview === 'dark' ? 'bg-slate-900' : 
                      logo.preview === 'light' ? 'bg-white' : 
                      'bg-gradient-to-br from-accent/20 via-card to-card'
                    }`}
                  >
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 rounded-xl mx-auto mb-2 flex items-center justify-center"
                        style={{ backgroundColor: logo.colors.primary }}
                      >
                        <span className="text-2xl font-bold text-white">M</span>
                      </div>
                      {logo.preview !== 'icon' && (
                        <span 
                          className="font-bold"
                          style={{ color: logo.colors.secondary || logo.colors.primary }}
                        >
                          My Doctor Hub
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">{logo.variant}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{logo.description}</p>
                    <p className="text-xs text-accent">{logo.usage}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Logo Usage Guidelines */}
          <Card className="mt-6 bg-card/50 border-border/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Logo Usage Guidelines</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Minimum Size</p>
                  <p className="text-sm text-muted-foreground">{assetsData.brandIdentity.logoUsage.minSize}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Clear Space</p>
                  <p className="text-sm text-muted-foreground">{assetsData.brandIdentity.logoUsage.clearSpace}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Don'ts</p>
                  <ul className="space-y-1">
                    {assetsData.brandIdentity.logoUsage.donts.map((item, idx) => (
                      <li key={idx} className="text-sm text-red-400/80">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Landing Page */}
        <TabsContent value="landing" className="mt-6 space-y-6">
          {/* Sections */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-6">Landing Page Structure</h3>
              <div className="space-y-4">
                {assetsData.landingPage.sections.map((section, index) => (
                  <div 
                    key={index}
                    className="flex gap-4 p-4 rounded-lg bg-muted/20 border border-border/30"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-accent">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{section.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{section.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {section.keyElements.map((element, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                          >
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Elements */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Conversion Elements</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {assetsData.landingPage.conversionElements.map((element, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-foreground">{element}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Download Note */}
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Landing Page Template</h3>
                <p className="text-sm text-muted-foreground">{assetsData.landingPage.downloadNote}</p>
              </div>
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground flex-shrink-0">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>

          {/* Additional Assets */}
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Additional Assets</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assetsData.mockupPreviews.map((preview, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-muted/20 border border-border/30">
                    <h4 className="font-medium text-foreground text-sm">{preview.type}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{preview.description}</p>
                    <p className="text-[10px] text-accent mt-2">{preview.specs}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandAssetsTab;
