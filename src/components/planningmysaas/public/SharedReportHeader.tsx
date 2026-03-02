import uaicodeLogo from "@/assets/uaicode-logo.png";

const SharedReportHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-accent/10">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default SharedReportHeader;
