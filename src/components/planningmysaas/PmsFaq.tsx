import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EmailContactDialog from "@/components/chat/EmailContactDialog";

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

        {/* Contact CTA */}
        <div className="mt-16 glass-premium rounded-2xl border border-accent/20 p-6 md:p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">💬</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is here to help you get started.
          </p>
          <button
            onClick={() => setShowEmailDialog(true)}
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold underline underline-offset-4 transition-colors"
          >
            Contact our support team
          </button>
        </div>
      </div>
    </section>
    <EmailContactDialog 
      open={showEmailDialog} 
      onOpenChange={setShowEmailDialog} 
      source="planningmysaas"
    />
    </>
  );
};

export default PmsFaq;
