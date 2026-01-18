import { useState } from "react";
import { Mail, Phone, MessageCircle, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EmailContactDialog from "@/components/chat/EmailContactDialog";
import KyleConsultantDialog from "@/components/planningmysaas/dashboard/KyleConsultantDialog";
import KyleChatDialog from "@/components/planningmysaas/dashboard/KyleChatDialog";
import KyleAvatar from "@/components/chat/KyleAvatar";

const DirectContactSection = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showKyleDialog, setShowKyleDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);

  return (
    <section id="direct-contact" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/20">
          <MessageCircle className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Direct Contact</h2>
          <p className="text-sm text-muted-foreground">
            Prefer a different way to reach us? Contact our sales team directly
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Email Kyle Card */}
        <Card 
          onClick={() => setShowEmailDialog(true)}
          className="cursor-pointer glass-card border-border/30 hover:border-amber-500/30 transition-all duration-300 hover-lift"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="relative">
              <KyleAvatar size="sm" isActive={true} />
              {/* Mail icon badge */}
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg border-2 border-background">
                <Mail className="h-3 w-3 text-black" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">Email Kyle</p>
                <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                  <Clock className="h-3 w-3" />
                  24h reply
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Get a detailed response</p>
            </div>
          </CardContent>
        </Card>

        {/* Chat with Kyle Card */}
        <Card 
          onClick={() => setShowChatDialog(true)}
          className="cursor-pointer glass-card border-border/30 hover:border-amber-500/30 transition-all duration-300 hover-lift"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="relative">
              <KyleAvatar size="sm" isActive={true} />
              {/* Chat icon badge */}
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg border-2 border-background">
                <MessageSquare className="h-3 w-3 text-black" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">Chat with Kyle</p>
                <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </span>
              </div>
              <p className="text-sm text-muted-foreground">AI Sales Consultant</p>
            </div>
          </CardContent>
        </Card>

        {/* Call Kyle Card */}
        <Card 
          onClick={() => setShowKyleDialog(true)}
          className="cursor-pointer glass-card border-border/30 hover:border-amber-500/30 transition-all duration-300 hover-lift"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="relative">
              <KyleAvatar size="sm" isActive={true} />
              {/* Phone icon badge */}
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg border-2 border-background">
                <Phone className="h-3 w-3 text-black" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground">Call Kyle</p>
                <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Available
                </span>
              </div>
              <p className="text-sm text-muted-foreground">24/7 Voice Support</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <EmailContactDialog 
        open={showEmailDialog} 
        onOpenChange={setShowEmailDialog}
        source="pms_sales_contact"
      />
      <KyleConsultantDialog 
        open={showKyleDialog} 
        onOpenChange={setShowKyleDialog}
      />
      <KyleChatDialog 
        open={showChatDialog} 
        onOpenChange={setShowChatDialog}
      />
    </section>
  );
};

export default DirectContactSection;
