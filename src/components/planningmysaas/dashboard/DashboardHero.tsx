import { CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { projectInfoData } from "@/lib/dashboardMockData";

const DashboardHero = () => {
  return (
    <div className="text-center space-y-6 py-8">
      {/* Badge do tipo de relatório */}
      <div className="flex justify-center">
        <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-1.5 text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          {projectInfoData.reportType}
        </Badge>
      </div>
      
      {/* Nome do projeto */}
      <h1 className="text-4xl md:text-5xl font-bold text-foreground">
        {projectInfoData.projectName}
      </h1>
      
      {/* Descrição */}
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {projectInfoData.description}
      </p>
      
      {/* Tags de tipo, indústria e mercado */}
      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="outline" className="px-3 py-1">
          {projectInfoData.saasType}
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          {projectInfoData.industry}
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          {projectInfoData.targetMarket}
        </Badge>
      </div>
      
      {/* Social proof */}
      <div className="flex justify-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-500/10 border border-green-500/20">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-400">
            {projectInfoData.successRate}% of similar projects delivered successfully by UaiCode
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
