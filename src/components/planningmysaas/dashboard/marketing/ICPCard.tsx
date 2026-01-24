import { Target, Users, Building2, MapPin, TrendingUp, AlertTriangle, Zap, MessageSquare, Linkedin, Instagram, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { ICPIntelligenceSection } from "@/types/report";

const getInitials = (name: string | undefined | null): string => {
  if (!name || name === "...") return "?";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

const ICPCard = () => {
  const { reportData } = useReportContext();

  // Parse ICP from database
  const icpData = parseJsonField<ICPIntelligenceSection | null>(
    reportData?.icp_intelligence_section,
    null
  );

  const hasData = !!icpData?.persona || !!icpData?.demographics || !!icpData?.pain_points?.length;

  // Persona
  const persona = hasData ? {
    name: icpData?.persona?.persona_name || icpData?.persona?.name || "...",
    initials: getInitials(icpData?.persona?.persona_name || icpData?.persona?.name),
    role: icpData?.persona?.job_title || icpData?.persona?.role || "...",
    business: icpData?.demographics?.industry || "..."
  } : {
    name: "...",
    initials: "?",
    role: "...",
    business: "..."
  };

  // Demographics - map from database or fallback
  const demographics = hasData && icpData?.demographics ? [
    { icon: Users, label: icpData.demographics.company_size || icpData.demographics.income_or_company_size || "..." },
    { icon: TrendingUp, label: icpData.demographics.growth_phase || "..." },
    { icon: Building2, label: icpData.demographics.industry || "..." },
    { icon: MapPin, label: icpData.demographics.geographic_region || icpData.demographics.location || "..." },
    { icon: Calendar, label: icpData.demographics.decision_authority || "..." },
  ] : [];

  // Goals from messaging hooks value propositions
  const goals = hasData && icpData?.messaging_hooks?.value_propositions?.length
    ? icpData.messaging_hooks.value_propositions.slice(0, 3)
    : [];

  // Pain points with severity
  const painPoints = hasData && icpData?.pain_points?.length
    ? icpData.pain_points.slice(0, 3).map(p => ({
        pain: p.pain_point,
        severity: parseInt(String(p.intensity_score)) || 50
      }))
    : [];

  // Buying triggers
  const triggers = hasData && icpData?.buying_triggers?.length
    ? icpData.buying_triggers.slice(0, 4)
    : [];

  // Preferred channels - flatten the object structure
  const channelIconMap: Record<string, typeof Linkedin> = {
    linkedin: Linkedin,
    instagram: Instagram,
    events: Calendar,
    trade_shows: Calendar,
    research: MessageSquare,
    social: Instagram,
  };

  const flattenChannels = (): string[] => {
    if (!hasData || !icpData?.preferred_channels) return [];
    const allChannels: string[] = [];
    if (icpData.preferred_channels.research?.length) {
      allChannels.push(...icpData.preferred_channels.research.slice(0, 1));
    }
    if (icpData.preferred_channels.social?.length) {
      allChannels.push(...icpData.preferred_channels.social.slice(0, 1));
    }
    if (icpData.preferred_channels.events?.length) {
      allChannels.push(...icpData.preferred_channels.events.slice(0, 1));
    }
    return allChannels.slice(0, 3);
  };

  const channels = flattenChannels().map(ch => ({
    icon: channelIconMap[ch.toLowerCase().replace(/\s+/g, '_')] || MessageSquare,
    name: ch,
    detail: ""
  }));

  // Messaging hooks
  const messages = hasData && icpData?.messaging_hooks?.value_propositions?.length
    ? icpData.messaging_hooks.value_propositions.slice(0, 3)
    : [];

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

      {/* Two Main Cards - Balanced */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Card 1: Persona Profile */}
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
            <div className="mb-4">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Demographics</span>
              {demographics.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {demographics.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/10 border border-border/20">
                      <item.icon className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                      <span className="text-xs text-foreground truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-4">...</div>
              )}
            </div>

            {/* Goals */}
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Goals</span>
              {goals.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {goals.map((goal, i) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-accent/10 text-foreground border-accent/20">
                      {goal}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-2">...</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Buyer Journey (Pain Points + Triggers + Channels + Messaging) */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            {/* Pain Points */}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Pain Points</span>
              </div>
              {painPoints.length > 0 ? (
                <div className="space-y-2">
                  {painPoints.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground">{item.pain}</span>
                        <span className={`text-[10px] font-bold ${item.severity >= 80 ? 'text-destructive' : 'text-warning'}`}>
                          {item.severity}%
                        </span>
                      </div>
                      <Progress 
                        value={item.severity} 
                        className={`h-1 ${item.severity >= 80 ? '[&>div]:bg-destructive' : '[&>div]:bg-warning'}`} 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-2">...</div>
              )}
            </div>

            {/* Buying Triggers + Channels inline */}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                <Zap className="h-3.5 w-3.5 text-accent" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Triggers & Channels</span>
              </div>
              {triggers.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {triggers.map((trigger, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] border-accent/20 text-accent">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-1">...</div>
              )}
              {channels.length > 0 ? (
                <div className="flex items-center gap-2">
                  {channels.map((ch, i) => (
                    <div key={i} className="flex items-center gap-1 px-2 py-1 rounded bg-muted/10 border border-border/20">
                      <ch.icon className="h-3 w-3 text-accent" />
                      <span className="text-[10px] text-foreground">{ch.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-1">...</div>
              )}
            </div>

            {/* Messaging That Converts - Integrated */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <MessageSquare className="h-3.5 w-3.5 text-accent" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Messaging Hooks</span>
              </div>
              {messages.length > 0 ? (
                <div className="space-y-1.5">
                  {messages.map((msg, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted/10 border border-border/20">
                      <p className="text-xs text-foreground">"{msg}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-2">...</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ICPCard;
