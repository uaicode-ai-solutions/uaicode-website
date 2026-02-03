import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SharedReportFooter = () => {
  return (
    <div className="space-y-8">
      {/* CTA Card */}
      <div className="glass-card border-accent/20 rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Want Your Own SaaS Validation Report?
            </h3>
            <p className="text-muted-foreground">
              Get comprehensive market research, financial projections, and actionable insights for your SaaS idea.
            </p>
          </div>
          <Button
            asChild
            className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
          >
            <Link to="/planningmysaas">
              Create Your Report
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <Link 
            to="/planningmysaas" 
            className="text-accent hover:underline font-medium"
          >
            PlanningMySaaS
          </Link>
          {" "}|{" "}
          <a 
            href="https://uaicode.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            uaicode.ai
          </a>
        </p>
      </footer>
    </div>
  );
};

export default SharedReportFooter;