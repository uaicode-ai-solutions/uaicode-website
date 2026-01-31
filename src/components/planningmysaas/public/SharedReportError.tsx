import { Link } from "react-router-dom";
import { FileX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SharedReportHeader from "./SharedReportHeader";

const SharedReportError = () => {
  return (
    <div className="min-h-screen bg-background">
      <SharedReportHeader />
      
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
            <FileX className="h-10 w-10 text-muted-foreground" />
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Report Not Found
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            This report may have been removed, or sharing has been disabled by the owner.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
            >
              <Link to="/planningmysaas">
                Create Your Own Report
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Subtle branding */}
          <p className="text-sm text-muted-foreground mt-12">
            Powered by{" "}
            <Link 
              to="/planningmysaas" 
              className="text-accent hover:underline"
            >
              PlanningMySaaS
            </Link>
            {" "}| uaicode.ai
          </p>
        </div>
      </main>
    </div>
  );
};

export default SharedReportError;
