import { Layout, Monitor, Smartphone, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { screenMockups } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const ScreenMockups = () => (
  <div className="space-y-6">
    {/* Section Header */}
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg icon-container-premium">
        <Layout className="h-5 w-5 text-accent" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Screen Mockups</h2>
        <p className="text-sm text-muted-foreground">Key screens for your application</p>
      </div>
    </div>

    {/* Mockups Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {screenMockups.map((mockup, index) => (
        <Card 
          key={index} 
          className="metric-card-premium bg-card/50 border-border/30 hover:border-accent/30 group overflow-hidden"
        >
          <CardContent className="p-0">
            {/* Screen Preview Area */}
            <div className="aspect-video bg-gradient-to-br from-muted/30 via-muted/10 to-transparent relative overflow-hidden">
              {/* Device frame */}
              <div className="absolute inset-3 rounded-md border border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-center group-hover:border-accent/30 transition-colors">
                {mockup.category === "Mobile" ? (
                  <Smartphone className="h-8 w-8 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
                ) : (
                  <Monitor className="h-8 w-8 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
                )}
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                  {mockup.name}
                </h3>
                <Badge variant="outline" className="text-[10px] border-border/50">
                  {mockup.category}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {mockup.description}
              </p>

              {/* Features Tags */}
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
  </div>
);

export default ScreenMockups;