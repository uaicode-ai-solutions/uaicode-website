import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Briefcase,
  Building2,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { ICPIntelligenceSection } from "@/types/report";

interface TargetCustomerCardProps {
  icp: ICPIntelligenceSection | null | undefined;
  insight?: string;
}

const TargetCustomerCard: React.FC<TargetCustomerCardProps> = ({
  icp,
  insight,
}) => {
  if (!icp) {
    return (
      <Card className="glass-card border-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            Target Customer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Customer profile will appear once the analysis is complete...
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract persona data (try primary_personas first, then legacy persona field)
  const persona = icp.primary_personas?.[0] || null;
  const legacyPersona = icp.persona;
  const demographics = icp.demographics;
  const painPoints = icp.pain_points || persona?.pain_points_priority || [];
  const buyingTriggers = icp.buying_triggers || [];

  const personaName = persona?.persona_name || legacyPersona?.persona_name || legacyPersona?.name || "Ideal Customer";
  const jobTitle = persona?.job_title || legacyPersona?.job_title || legacyPersona?.role || "...";
  const companySize = persona?.company_size || demographics?.company_size || demographics?.income_or_company_size || "...";
  const industry = persona?.industry_focus || demographics?.industry || "...";
  const budgetRange = persona?.buying_behavior?.budget_range || icp.budget_timeline?.typical_budget || "...";
  const decisionTimeframe = persona?.buying_behavior?.decision_timeframe || icp.budget_timeline?.decision_timeline || "...";

  const getUrgencyColor = (urgency: string | undefined) => {
    if (!urgency) return "bg-muted/20 text-muted-foreground";
    switch (urgency.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-green-500/20 text-green-400";
    }
  };

  return (
    <Card className="glass-card border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-accent" />
          Target Customer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Persona Header */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/10 border border-border/20">
          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
            <User className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{personaName}</h4>
            <p className="text-sm text-muted-foreground">{jobTitle}</p>
          </div>
        </div>

        {/* Demographics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/10">
            <Building2 className="h-4 w-4 text-accent shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Company Size</p>
              <p className="text-sm font-medium text-foreground">{companySize}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/10">
            <Briefcase className="h-4 w-4 text-accent shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="text-sm font-medium text-foreground">{industry}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/10">
            <DollarSign className="h-4 w-4 text-accent shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-sm font-medium text-foreground">{budgetRange}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/10">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Decision Time</p>
              <p className="text-sm font-medium text-foreground">{decisionTimeframe}</p>
            </div>
          </div>
        </div>

        {/* Top Pain Points */}
        {painPoints.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-accent" />
              Top Pain Points
            </h4>
            <div className="space-y-2">
              {painPoints.slice(0, 3).map((pain, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-2 p-3 rounded-lg bg-muted/10 border border-border/20"
                >
                  <p className="text-sm text-foreground flex-1">
                    {pain.pain_point}
                  </p>
                  {pain.urgency_level && (
                    <Badge className={`text-xs shrink-0 ${getUrgencyColor(pain.urgency_level)}`}>
                      {pain.urgency_level}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buying Triggers */}
        {buyingTriggers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {buyingTriggers.slice(0, 4).map((trigger, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {trigger}
              </Badge>
            ))}
          </div>
        )}

        {/* AI Insight */}
        {insight && (
          <div className="p-4 rounded-lg bg-accent/10 border-l-4 border-accent">
            <p className="text-sm text-foreground italic">"{insight}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TargetCustomerCard;
