import { Link } from "react-router-dom";
import uaicodeLogo from "@/assets/uaicode-logo.png";

const SharedReportHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-accent/10">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo + Brand */}
          <Link 
            to="/planningmysaas"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src={uaicodeLogo} 
              alt="UAICode" 
              className="h-9 w-9 rounded-lg"
            />
            <div>
              <span className="text-lg font-bold text-foreground">
                Planning<span className="text-accent">My</span>SaaS
              </span>
            </div>
          </Link>

          {/* Right side - Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <span className="text-sm font-medium text-accent">
              Shared Business Plan
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SharedReportHeader;
