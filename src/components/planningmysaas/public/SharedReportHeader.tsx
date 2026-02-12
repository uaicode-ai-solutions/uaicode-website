import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, Phone } from "lucide-react";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import kyleAvatar from "@/assets/kyle-avatar.webp";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import KyleConsultantDialog from "@/components/planningmysaas/dashboard/KyleConsultantDialog";
import KyleChatDialog from "@/components/planningmysaas/dashboard/KyleChatDialog";
import EmailKyleDialog from "@/components/planningmysaas/dashboard/EmailKyleDialog";
import { useReportContext } from "@/contexts/ReportContext";

const SharedReportHeader = () => {
  const [kyleDialogOpen, setKyleDialogOpen] = useState(false);
  const [kyleChatDialogOpen, setKyleChatDialogOpen] = useState(false);
  const [emailKyleDialogOpen, setEmailKyleDialogOpen] = useState(false);
  const { wizardId } = useReportContext();

  return (
    <>
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

            {/* Right side - Kyle Avatar + Badge */}
            <div className="flex items-center gap-2">
              {/* Kyle Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover:bg-amber-500/10 border border-amber-500/30 rounded-full h-10 w-10 transition-all duration-300"
                  >
                    <img src={kyleAvatar} alt="Kyle" className="h-9 w-9 rounded-full object-cover" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover border-amber-500/20">
                  <DropdownMenuItem onClick={() => setEmailKyleDialogOpen(true)} className="cursor-pointer">
                    <Mail className="h-4 w-4 mr-2" /> Email Kyle
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setKyleChatDialogOpen(true)} className="cursor-pointer">
                    <MessageSquare className="h-4 w-4 mr-2" /> Chat with Kyle
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setKyleDialogOpen(true)} className="cursor-pointer">
                    <Phone className="h-4 w-4 mr-2" /> Call Kyle
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="text-sm font-medium text-accent">
                  Shared Business Plan
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Kyle Dialogs */}
      <KyleConsultantDialog 
        open={kyleDialogOpen} 
        onOpenChange={setKyleDialogOpen}
        wizardId={wizardId}
      />
      <KyleChatDialog 
        open={kyleChatDialogOpen} 
        onOpenChange={setKyleChatDialogOpen}
        wizardId={wizardId}
      />
      <EmailKyleDialog 
        open={emailKyleDialogOpen} 
        onOpenChange={setEmailKyleDialogOpen}
      />
    </>
  );
};

export default SharedReportHeader;
