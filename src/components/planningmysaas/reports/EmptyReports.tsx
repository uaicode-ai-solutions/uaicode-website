import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyReports = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
        <FileText className="h-8 w-8 text-accent" />
      </div>
      
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No reports yet
      </h2>
      
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        Create your first SaaS validation report and get AI-powered insights 
        for your business idea.
      </p>
      
      <Button 
        onClick={() => navigate("/planningmysaas/wizard")}
        className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <Plus className="h-4 w-4" />
        Create Your First Report
      </Button>
    </div>
  );
};

export default EmptyReports;
