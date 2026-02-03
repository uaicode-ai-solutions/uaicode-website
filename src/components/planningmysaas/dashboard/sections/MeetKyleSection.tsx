import { useState } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import kyleAvatar from "@/assets/kyle-avatar.webp";
import KyleConsultantDialog from "../KyleConsultantDialog";
import KyleChatDialog from "../KyleChatDialog";
import EmailKyleDialog from "../EmailKyleDialog";

interface MeetKyleSectionProps {
  wizardId: string | undefined;
}

const MeetKyleSection = ({ wizardId }: MeetKyleSectionProps) => {
  const [kyleDialogOpen, setKyleDialogOpen] = useState(false);
  const [kyleChatDialogOpen, setKyleChatDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  return (
    <section className="py-6">
      <Card className="glass-card border-amber-500/20 p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Avatar Pequeno */}
          <img
            src={kyleAvatar}
            alt="Kyle - AI Sales Consultant"
            className="w-16 h-16 rounded-full border-2 border-amber-500/30 object-cover flex-shrink-0"
          />
          
          {/* Texto */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-base font-medium text-foreground">
              Have questions? <span className="text-gradient-gold font-bold">Talk to Kyle</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Your AI sales consultant, available 24/7
            </p>
          </div>
          
          {/* Botões Compactos */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setEmailDialogOpen(true)} 
              variant="outline" 
              size="sm"
              className="gap-2 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </Button>
            <Button 
              onClick={() => setKyleChatDialogOpen(true)} 
              variant="outline" 
              size="sm"
              className="gap-2 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
            <Button 
              onClick={() => setKyleDialogOpen(true)} 
              size="sm" 
              className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Dialogs - mantidos iguais */}
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
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen}
      />
    </section>
  );
};

export default MeetKyleSection;
