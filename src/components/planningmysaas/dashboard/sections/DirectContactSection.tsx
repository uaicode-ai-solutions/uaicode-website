import { useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EmailContactDialog from "@/components/chat/EmailContactDialog";
import KyleConsultantDialog from "@/components/planningmysaas/dashboard/KyleConsultantDialog";

const DirectContactSection = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showKyleDialog, setShowKyleDialog] = useState(false);

  return (
    <section id="direct-contact" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <MessageCircle className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Direct Contact</h2>
          <p className="text-sm text-muted-foreground">
            Prefer a different way to reach us? Contact our sales team directly
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email Card */}
        <Card 
          onClick={() => setShowEmailDialog(true)}
          className="cursor-pointer hover:border-accent/50 transition-all hover:shadow-lg group"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
              <Mail className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email Us</p>
              <p className="font-semibold text-foreground">sales@uaicode.ai</p>
            </div>
          </CardContent>
        </Card>

        {/* Phone Card */}
        <Card 
          onClick={() => setShowKyleDialog(true)}
          className="cursor-pointer hover:border-accent/50 transition-all hover:shadow-lg group"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors relative">
              <Phone className="h-6 w-6 text-accent" />
              {/* Online indicator */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Call Kyle</p>
              <p className="font-semibold text-foreground">+1 (321) 392 8515</p>
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
    </section>
  );
};

export default DirectContactSection;
