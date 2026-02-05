import { useState } from "react";
import { Mail, MessageSquare, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import eveImage from "@/assets/eve-avatar.webp";
import EmailContactDialog from "@/components/chat/EmailContactDialog";
import EveChatDialog from "@/components/chat/EveChatDialog";
import EveVoiceDialog from "@/components/chat/EveVoiceDialog";

const MeetEve = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
  const navigate = useNavigate();

  return (
    <section id="eve" className="bg-black py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-gradient-gold">Meet Eve</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Your AI Assistant, Available 24/7
              </p>
            </div>

            <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
              <p>
                Eve Morgan is your friendly AI assistant at Uaicode. She's here to answer your questions about idea validation, help you understand if your SaaS concept has market potential, and guide you through our process.
              </p>

              <p>
                Whether you want to chat about your idea, learn more about Planning My SaaS, or understand what happens after validation—Eve is ready to help you take the next step.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setShowEmailDialog(true)}
                variant="outline"
                size="lg"
                className="border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300"
              >
                <Mail className="h-5 w-5" />
                Email Eve
              </Button>
              <Button
                onClick={() => setShowChatDialog(true)}
                variant="outline"
                size="lg"
                className="border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5" />
                Chat with Eve
              </Button>
              <Button
                onClick={() => setShowVoiceDialog(true)}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold transition-all duration-300 hover:scale-105"
              >
                <Phone className="h-5 w-5" />
                Call Eve
              </Button>
            </div>

            {/* Planning My SaaS CTA */}
            <button 
              onClick={() => navigate("/planningmysaas")}
              className="w-full p-4 bg-accent/10 border border-accent/30 rounded-lg text-left hover:bg-accent/20 transition-colors group"
            >
              <div className="flex items-center gap-2 text-accent font-medium">
                <Sparkles className="h-5 w-5" />
                Try Planning My SaaS
              </div>
              <p className="text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
                Get a free AI-powered market analysis for your SaaS idea →
              </p>
            </button>

          </div>

          {/* Right Column - Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accent/5 rounded-full blur-2xl" />
              <img
                src={eveImage}
                alt="Eve Morgan - AI Assistant at Uaicode"
                loading="lazy"
                className="relative w-full h-auto max-w-md lg:max-w-lg rounded-full shadow-2xl hover-lift border-4 border-accent/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EmailContactDialog 
        open={showEmailDialog} 
        onOpenChange={setShowEmailDialog} 
      />
      <EveChatDialog 
        open={showChatDialog} 
        onOpenChange={setShowChatDialog} 
      />
      <EveVoiceDialog 
        open={showVoiceDialog} 
        onOpenChange={setShowVoiceDialog} 
      />
    </section>
  );
};

export default MeetEve;
