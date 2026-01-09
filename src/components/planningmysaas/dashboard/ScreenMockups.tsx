import { Layout, Monitor, Smartphone, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { screenMockups } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const ScreenMockups = () => (
  <div className="space-y-8">
    {/* Section Header */}
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl icon-container-premium">
        <Layout className="h-6 w-6 text-accent" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Screen Mockups</h2>
        <p className="text-muted-foreground">Key screens for your application</p>
      </div>
    </div>

    {/* Mockups Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {screenMockups.map((mockup, index) => (
        <Card 
          key={index} 
          className="metric-card-premium bg-card/50 border-border/30 hover:border-accent/30 group overflow-hidden"
        >
          <CardContent className="p-0">
            {/* Screen Preview Area */}
            <div className="aspect-video bg-gradient-to-br from-muted/30 via-muted/10 to-transparent relative overflow-hidden">
              {/* Device frame */}
              <div className="absolute inset-4 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-center group-hover:border-accent/30 transition-colors">
                {mockup.category === "Mobile" ? (
                  <Smartphone className="h-12 w-12 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
                ) : (
                  <Monitor className="h-12 w-12 text-muted-foreground/30 group-hover:text-accent/50 transition-colors" />
                )}
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">
                  {mockup.name}
                </h3>
                <Badge variant="outline" className="text-xs border-border/50">
                  {mockup.category}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {mockup.description}
              </p>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-1.5">
                {mockup.features.slice(0, 3).map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20"
                  >
                    {feature}
                  </span>
                ))}
                {mockup.features.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
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