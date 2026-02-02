import { useState } from "react";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section className="py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="space-y-8 order-2 lg:order-1">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-gold">Meet Kyle</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Your AI Sales Consultant
            </p>
          </div>

          <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
            <p>
              Kyle is your dedicated AI sales consultant at Uaicode.ai. 
              He's here 24/7 to answer your questions, walk you through 
              pricing options, and help you make the best decision for your project.
            </p>
            <p>
              Whether you prefer a quick chat, voice call, or detailed email 
              response, Kyle is always ready to assist with expert knowledge 
              about your specific report and our services.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setEmailDialogOpen(true)}
              variant="outline"
              size="lg"
              className="gap-3 border-amber-500/30 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300"
            >
              <Mail className="h-5 w-5" />
              <span>Email Kyle</span>
              <span className="text-xs opacity-70 ml-1">24h reply</span>
            </Button>
            
            <Button 
              onClick={() => setKyleChatDialogOpen(true)}
              variant="outline"
              size="lg"
              className="gap-3 border-amber-500/30 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Chat with Kyle</span>
              <span className="text-xs opacity-70 ml-1">Instant</span>
            </Button>
            
            <Button 
              onClick={() => setKyleDialogOpen(true)}
              size="lg"
              className="gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
            >
              <Phone className="h-5 w-5" />
              <span>Call Kyle</span>
              <span className="text-xs opacity-70 ml-1">24/7</span>
            </Button>
          </div>
        </div>

        {/* Right Column - Photo */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="relative">
            {/* Glow effect behind image */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-2xl blur-2xl scale-110" />
            
            <img
              src={kyleAvatar}
              alt="Kyle - AI Sales Consultant"
              className="relative w-full h-auto max-w-sm rounded-2xl shadow-2xl shadow-amber-500/20 border-2 border-amber-500/30"
            />
            
            {/* Name Badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm px-6 py-3 rounded-xl border border-amber-500/30 shadow-lg">
              <p className="font-bold text-foreground text-center">Kyle Williams</p>
              <p className="text-sm text-amber-400 text-center">AI Sales Consultant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
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
