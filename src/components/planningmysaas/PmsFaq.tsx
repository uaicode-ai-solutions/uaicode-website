import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone } from "lucide-react";
import EmailContactDialog from "@/components/chat/EmailContactDialog";
import EveChatDialog from "@/components/chat/EveChatDialog";
import EveVoiceDialog from "@/components/chat/EveVoiceDialog";
import EveAvatar from "@/components/chat/EveAvatar";

const faqs = [
  {
    question: "How long does it take to generate my report?",
    answer: "Most reports are generated within 5 minutes. Our AI analyzes your idea in real-time, compiling comprehensive market insights, financial projections, and a complete business plan.",
  },
  {
    question: "What's included in my validation report?",
    answer: "You receive a complete package: viability score (0-100), market size analysis (TAM/SAM/SOM), competitor intelligence, customer pain points, risk assessment, financial projections, and a full AI-generated business plan.",
  },
  {
    question: "Where does the market data come from?",
    answer: "We aggregate data from multiple reliable sources including industry reports, public databases, and real-time market trends. Our AI cross-references this data to provide accurate, up-to-date insights.",
  },
  {
    question: "Is my idea kept confidential?",
    answer: "Absolutely. Your idea and all submitted information are encrypted and never shared. We take confidentiality seriously and have strict data protection policies in place.",
  },
  {
    question: "Can I share my report with investors or partners?",
    answer: "Yes! Each report includes a shareable public link that you can send to investors, co-founders, or advisors. You can also export your business plan as a PDF.",
  },
  {
    question: "Can I validate multiple ideas?",
    answer: "Yes, you can create unlimited reports — it's completely free. Each idea gets its own dedicated dashboard with full analysis.",
  },
  {
    question: "Who is Kyle and how can he help me?",
    answer: "Kyle is your AI business consultant available in the \"Next Steps\" tab. He can answer questions about your report, explain metrics, and provide strategic advice based on your specific analysis.",
  },
  {
    question: "Is PlanningMySaas really free?",
    answer: "Yes, 100% free with no hidden costs. You get the same comprehensive validation that traditional consulting firms charge $10,000+ for — viability analysis, business plan, financials, and AI consultant access.",
  },
];

const PmsFaq = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  return (
    <>
    <section id="faq" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-accent/30 mb-6">
            <span className="text-sm font-medium text-accent">FAQ</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We've got answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card border border-border/50 rounded-xl px-6 data-[state=open]:border-accent/30 data-[state=open]:shadow-lg data-[state=open]:shadow-accent/5 transition-all duration-300"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline py-5 group">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-accent/60 group-hover:text-accent transition-colors min-w-[24px]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 pl-9 text-sm leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA - Meet Eve */}
        <div className="mt-16 glass-premium rounded-2xl border border-accent/20 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Eve Avatar */}
            <div className="flex-shrink-0">
              <EveAvatar size="lg" />
            </div>
            
            {/* Text Content */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-foreground">
                Need help? <span className="text-gradient-gold">Talk to Eve</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Your AI assistant, available 24/7
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowEmailDialog(true)} 
                variant="outline" 
                size="sm"
                className="gap-2 border-accent/30 hover:bg-accent/10 hover:border-accent/50"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </Button>
              <Button 
                onClick={() => setShowChatDialog(true)} 
                variant="outline" 
                size="sm"
                className="gap-2 border-accent/30 hover:bg-accent/10 hover:border-accent/50"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Chat</span>
              </Button>
              <Button 
                onClick={() => setShowVoiceDialog(true)} 
                size="sm"
                className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Call</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Dialogs */}
    <EmailContactDialog 
      open={showEmailDialog} 
      onOpenChange={setShowEmailDialog} 
      source="planningmysaas"
    />
    <EveChatDialog 
      open={showChatDialog} 
      onOpenChange={setShowChatDialog} 
    />
    <EveVoiceDialog 
      open={showVoiceDialog} 
      onOpenChange={setShowVoiceDialog} 
    />
    </>
  );
};

export default PmsFaq;
