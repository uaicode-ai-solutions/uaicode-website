import { Target, User, Building2, MapPin, TrendingUp, AlertTriangle, Zap, MessageSquare, Linkedin, Instagram, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InfoTooltip } from "@/components/ui/info-tooltip";

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
      { channel: "Trade Shows", icon: Calendar, specifics: "NRA Show, Natural Products Expo" }
    ],
    messagingHooks: [
      "Save 10+ hours per week on inventory",
      "Compete with big platforms on delivery",
      "Stay compliant with one click"
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
    <section id="icp-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Ideal Customer Profile
              <InfoTooltip term="ICP">
                A detailed description of the perfect customer for your product. Understanding your ICP helps focus marketing efforts and messaging for maximum conversion.
              </InfoTooltip>
            </h2>
            <p className="text-sm text-muted-foreground">Who you should target for maximum conversion</p>
          </div>
        </div>
      </div>

      {/* Customer Avatar & Demographics */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Persona Card */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Customer Avatar</h3>
            <InfoTooltip size="sm">
              A fictional representation of your ideal customer based on market research and data.
            </InfoTooltip>
          </div>
          <Card className="glass-premium border-accent/30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
            <CardContent className="p-6 relative">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-accent/30">
                  <AvatarFallback className="bg-accent/20 text-accent text-xl font-bold">
                    {icp.persona.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-foreground">{icp.persona.name}</h4>
                  <p className="text-sm text-muted-foreground">{icp.persona.age} years old</p>
                  <Badge variant="outline" className="mt-2 border-accent/30 text-accent text-sm">
                    {icp.persona.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1.5">{icp.persona.businessType}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <span className="text-sm text-accent font-medium">Goals</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {icp.psychographics.goals.map((goal, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-accent/10 text-foreground border-accent/20">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground font-medium">Values</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {icp.psychographics.values.map((value, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-muted/20 text-foreground border-border/30">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Profile Card */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Company Profile</h3>
            <InfoTooltip size="sm">
              Demographic characteristics of target companies including size, revenue, and industry.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-accent/20">
            <CardContent className="p-5">
              <div className="space-y-2">
                {[
                  { label: "Company Size", value: icp.demographics.companySize, icon: Users },
                  { label: "Annual Revenue", value: icp.demographics.annualRevenue, icon: TrendingUp },
                  { label: "Industry", value: icp.demographics.industry, icon: Building2 },
                  { label: "Location", value: icp.demographics.location, icon: MapPin },
                  { label: "Business Stage", value: icp.demographics.businessStage, icon: Calendar }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/20">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <item.icon className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pain Points & Buying Triggers */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Pain Points */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Pain Points</h3>
            <InfoTooltip size="sm">
              The specific problems and frustrations your target customer experiences. Understanding these helps craft compelling messaging.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-border/30">
            <CardContent className="p-5">
              <div className="space-y-2">
                {icp.painPoints.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/10 border border-border/20"
                  >
                    <span className="text-sm text-foreground">{item.pain}</span>
                    <Badge className={`${getSeverityColor(item.severity)} capitalize text-[10px]`}>
                      {item.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buying Triggers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Buying Triggers</h3>
            <InfoTooltip size="sm">
              Events or circumstances that activate purchase intent. Target your outreach when these triggers occur for higher conversion rates.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-accent/20">
            <CardContent className="p-5">
              <div className="space-y-2">
                {icp.buyingTriggers.map((trigger, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-accent/5 border border-accent/20"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-sm text-foreground">{trigger}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Where to Find & Messaging - Combined */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Where to Find */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Where to Find Them</h3>
            <InfoTooltip size="sm">
              Channels and platforms where your target customers are most active and reachable.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-accent/20">
            <CardContent className="p-5">
              <div className="space-y-2">
                {icp.whereToFind.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/10 border border-border/20"
                  >
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <item.icon className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.channel}</p>
                      <p className="text-xs text-muted-foreground">{item.specifics}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messaging Hooks */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Messaging That Works</h3>
            <InfoTooltip size="sm">
              Proven messaging hooks that resonate with your target audience and drive action.
            </InfoTooltip>
          </div>
          <Card className="bg-card/50 border-accent/20">
            <CardContent className="p-5">
              <div className="space-y-2">
                {icp.messagingHooks.map((hook, i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded-lg bg-accent/10 border border-accent/20"
                  >
                    <p className="text-sm text-foreground font-medium">"{hook}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decision Makers */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Decision Makers</h3>
          <InfoTooltip size="sm">
            Key stakeholders involved in the purchasing decision. Understanding who influences the buy helps tailor your sales approach.
          </InfoTooltip>
        </div>
        <Card className="bg-card/50 border-accent/20">
          <CardContent className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {icp.decisionMakers.map((dm, i) => (
                <div 
                  key={i} 
                  className="text-center p-3 rounded-lg bg-accent/5 border border-accent/20"
                >
                  <Avatar className="h-10 w-10 mx-auto mb-2 border border-accent/30">
                    <AvatarFallback className="bg-accent/20 text-accent text-xs">
                      {dm.role.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-medium text-foreground text-sm">{dm.role}</p>
                  <Badge variant="outline" className="mt-1.5 text-[10px] border-accent/30 text-muted-foreground">
                    {dm.influence}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ICPCard;