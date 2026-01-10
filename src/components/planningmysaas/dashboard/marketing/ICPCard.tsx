import { Target, User, Building2, MapPin, TrendingUp, AlertTriangle, Zap, MessageSquare, Linkedin, Instagram, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ICPCard = () => {
  const icp = {
    persona: {
      name: "Maria Santos",
      age: 42,
      role: "CEO & Founder",
      businessType: "Health Product Store"
    },
    demographics: {
      companySize: "10-50 employees",
      annualRevenue: "$500K - $5M",
      industry: "Health & Wellness Retail",
      location: "Urban markets, US & LATAM",
      businessStage: "Growth phase (2-7 years)"
    },
    psychographics: {
      goals: ["Scale without losing quality", "Compete with big platforms", "Build customer loyalty"],
      motivations: ["Family business legacy", "Health impact", "Financial independence"],
      values: ["Quality over quantity", "Customer relationships", "Innovation"]
    },
    painPoints: [
      { pain: "Losing sales to big platforms", severity: "high" },
      { pain: "Manual inventory takes 3+ hours/day", severity: "high" },
      { pain: "No integrated delivery solution", severity: "medium" },
      { pain: "Compliance documentation is complex", severity: "medium" }
    ],
    buyingTriggers: [
      "Hiring new staff members",
      "Opening second location",
      "Seasonal demand spike",
      "Competitor launching online store"
    ],
    decisionMakers: [
      { role: "Owner/CEO", influence: "Final decision" },
      { role: "Operations Manager", influence: "Daily usage" },
      { role: "Accountant", influence: "Cost approval" }
    ],
    whereToFind: [
      { channel: "LinkedIn", icon: Linkedin, specifics: "Health business groups, SMB forums" },
      { channel: "Instagram", icon: Instagram, specifics: "Business hashtags, local suppliers" },
      { channel: "Trade Shows", icon: Calendar, specifics: "NRA Show, Natural Products Expo" },
      { channel: "Industry Publications", icon: MessageSquare, specifics: "Health Store News, Nutrition Business Journal" }
    ],
    messagingHooks: [
      "Save 10+ hours per week on inventory",
      "Compete with big platforms on delivery",
      "Stay compliant with one click",
      "Grow your business without hiring"
    ]
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-muted/20 text-muted-foreground border-border/30";
    }
  };

  return (
    <section id="icp-section" className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ideal Customer Profile (ICP)</h2>
          <p className="text-sm text-muted-foreground">Who you should target for maximum conversion</p>
        </div>
      </div>

      {/* Customer Avatar & Demographics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Persona Card */}
        <Card className="glass-premium border-accent/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
          <CardContent className="p-6 relative">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              Customer Avatar
            </h3>
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-2 border-accent/30">
                <AvatarFallback className="bg-accent/20 text-accent text-2xl font-bold">
                  {icp.persona.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-foreground">{icp.persona.name}</h4>
                <p className="text-muted-foreground">{icp.persona.age} years old</p>
                <Badge variant="outline" className="mt-2 border-accent/30 text-accent">
                  {icp.persona.role}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">{icp.persona.businessType}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <h5 className="text-sm font-medium text-muted-foreground">Psychographics</h5>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-accent">Goals:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {icp.psychographics.goals.map((goal, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-accent/10 text-foreground border-accent/20">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-accent">Values:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {icp.psychographics.values.map((value, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-muted/20 text-foreground border-border/30">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Profile Card */}
        <Card className="bg-card/50 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              Company Profile
            </h3>
            <div className="space-y-4">
              {[
                { label: "Company Size", value: icp.demographics.companySize, icon: Users },
                { label: "Annual Revenue", value: icp.demographics.annualRevenue, icon: TrendingUp },
                { label: "Industry", value: icp.demographics.industry, icon: Building2 },
                { label: "Location", value: icp.demographics.location, icon: MapPin },
                { label: "Business Stage", value: icp.demographics.businessStage, icon: Calendar }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/20">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <item.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pain Points & Buying Triggers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pain Points */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Pain Points
            </h3>
            <div className="space-y-3">
              {icp.painPoints.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/20"
                >
                  <span className="text-foreground">{item.pain}</span>
                  <Badge className={`${getSeverityColor(item.severity)} capitalize`}>
                    {item.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buying Triggers */}
        <Card className="bg-card/50 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              Buying Triggers
            </h3>
            <div className="space-y-3">
              {icp.buyingTriggers.map((trigger, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20"
                >
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-foreground">{trigger}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Where to Find & Messaging */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Where to Find */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Where to Find Them
            </h3>
            <div className="space-y-3">
              {icp.whereToFind.map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/10 border border-border/20"
                >
                  <div className="p-2 rounded-lg bg-accent/10">
                    <item.icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.channel}</p>
                    <p className="text-sm text-muted-foreground">{item.specifics}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messaging Hooks */}
        <Card className="glass-premium border-accent/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
          <CardContent className="p-6 relative">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-accent" />
              Messaging That Works
            </h3>
            <div className="space-y-3">
              {icp.messagingHooks.map((hook, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-lg bg-accent/10 border border-accent/20"
                >
                  <p className="text-foreground font-medium">"{hook}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Makers */}
      <Card className="bg-card/50 border-accent/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
            <Users className="h-4 w-4 text-accent" />
            Decision Makers in the Buying Process
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {icp.decisionMakers.map((dm, i) => (
              <div 
                key={i} 
                className="text-center p-4 rounded-lg bg-accent/5 border border-accent/20"
              >
                <Avatar className="h-12 w-12 mx-auto mb-3 border border-accent/30">
                  <AvatarFallback className="bg-accent/20 text-accent">
                    {dm.role.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium text-foreground">{dm.role}</p>
                <Badge variant="outline" className="mt-2 text-xs border-accent/30 text-muted-foreground">
                  {dm.influence}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ICPCard;
