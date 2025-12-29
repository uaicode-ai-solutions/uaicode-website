import { Button } from "@/components/ui/button";
import { TrendingUp, Bot, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import aiAutomationImg from "@/assets/insight-ai-automation-guide.webp";
import techStackImg from "@/assets/insight-tech-stack-mvp.webp";

export const CourseBanners = () => {
  return (
    <div className="space-y-4">
      {/* Course 1 - Business */}
      <div className="glass-card rounded-xl overflow-hidden hover-lift group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={aiAutomationImg}
            alt="AI Sales Automation"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs">
            Business
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-tight group-hover:text-accent transition-colors">
              AI Sales Automation Mastery
            </h3>
            <TrendingUp className="h-5 w-5 text-accent flex-shrink-0" />
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            Transform your sales pipeline with AI-powered automation and intelligent lead qualification.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-lg font-bold text-foreground">$299</span>
            <Button size="sm" className="gap-1">
              Enroll
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Course 2 - Technology */}
      <div className="glass-card rounded-xl overflow-hidden hover-lift group">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={techStackImg}
            alt="Build AI Agents"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs">
            Technology
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-tight group-hover:text-accent transition-colors">
              Build AI Agents from Scratch
            </h3>
            <Bot className="h-5 w-5 text-accent flex-shrink-0" />
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            Master AI agent development from fundamentals to production. Create intelligent agents that solve real-world problems.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-lg font-bold text-foreground">$399</span>
            <Button size="sm" className="gap-1">
              Learn
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
