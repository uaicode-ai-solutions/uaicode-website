import { Target, Users, Building2, MapPin, TrendingUp, AlertTriangle, Zap, MessageSquare, Linkedin, Instagram, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { InfoTooltip } from "@/components/ui/info-tooltip";

const ICPCard = () => {
  const persona = {
    name: "Maria Santos",
    initials: "MS",
    age: 42,
    role: "CEO & Founder",
    business: "Health Product Store"
  };

  const demographics = [
    { icon: Users, label: "10-50 employees" },
    { icon: TrendingUp, label: "$500K-$5M revenue" },
    { icon: Building2, label: "Health & Wellness" },
    { icon: MapPin, label: "US & LATAM" },
    { icon: Calendar, label: "Growth phase" },
  ];

  const goals = ["Scale operations", "Beat big platforms", "Build loyalty"];
  
  const painPoints = [
    { pain: "Losing sales to platforms", severity: 90 },
    { pain: "Manual inventory (3+ hrs/day)", severity: 85 },
    { pain: "No integrated delivery", severity: 65 },
    { pain: "Complex compliance docs", severity: 60 },
  ];

  const triggers = ["Hiring staff", "2nd location", "Seasonal spike", "Competitor online"];

  const channels = [
    { icon: Linkedin, name: "LinkedIn", detail: "B2B groups" },
    { icon: Instagram, name: "Instagram", detail: "Business hashtags" },
    { icon: Calendar, name: "Trade Shows", detail: "NRA Show, Expo" },
  ];

  const messages = [
    "Save 10+ hrs/week on inventory",
    "Compete on delivery speed",
    "One-click compliance",
  ];

  return (
    <section id="icp-section" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Ideal Customer Profile</h2>
            <InfoTooltip term="ICP" size="sm">
              Detailed description of the perfect customer for maximum conversion.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Target customer persona and buying behavior</p>
        </div>
      </div>

      {/* Two Main Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Persona + Demographics */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            {/* Persona Header */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border/20">
              <Avatar className="h-14 w-14 border-2 border-accent/30">
                <AvatarFallback className="bg-accent/20 text-accent text-lg font-bold">
                  {persona.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-base font-bold text-foreground">{persona.name}</h3>
                <Badge variant="outline" className="border-accent/30 text-accent text-xs mt-1">
                  {persona.role}
                </Badge>
                <p className="text-xs text-muted-foreground mt-0.5">{persona.business}</p>
              </div>
            </div>

            {/* Demographics Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {demographics.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/20">
                  <item.icon className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  <span className="text-xs text-foreground truncate">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Goals */}
            <div>
              <span className="text-xs text-muted-foreground font-medium">Goals</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {goals.map((goal, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-accent/10 text-foreground border-accent/20">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Pain Points + Behavior */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            {/* Pain Points with Visual Bars */}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-3">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                <span className="text-xs font-medium text-foreground">Pain Points</span>
              </div>
              <div className="space-y-2.5">
                {painPoints.map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground">{item.pain}</span>
                      <span className={`text-[10px] font-bold ${item.severity >= 80 ? 'text-red-400' : 'text-amber-400'}`}>
                        {item.severity}%
                      </span>
                    </div>
                    <Progress 
                      value={item.severity} 
                      className={`h-1.5 ${item.severity >= 80 ? '[&>div]:bg-red-400' : '[&>div]:bg-amber-400'}`} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Buying Triggers */}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                <Zap className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium text-foreground">Buying Triggers</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {triggers.map((trigger, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] border-accent/20 text-accent">
                    {trigger}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Where to Find */}
            <div className="flex items-center gap-2">
              {channels.map((ch, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/10 border border-border/20">
                  <ch.icon className="h-3 w-3 text-accent" />
                  <span className="text-[10px] text-foreground">{ch.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messaging Hooks */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-3.5 w-3.5 text-accent" />
            <span className="text-sm font-medium text-foreground">Messaging That Converts</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {messages.map((msg, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/10 border border-border/20 text-center">
                <p className="text-xs text-foreground font-medium">"{msg}"</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ICPCard;
