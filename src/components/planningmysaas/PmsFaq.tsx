import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does it take to generate my report?",
    answer: "Most reports are generated within 5 minutes. Our AI works in real-time to analyze your idea and compile comprehensive insights. Complex analyses for the Enterprise tier may take up to 15 minutes.",
  },
  {
    question: "Where does the market data come from?",
    answer: "We aggregate data from multiple reliable sources including industry reports, public databases, competitor analysis tools, and real-time market trends. Our AI cross-references this data to provide accurate, up-to-date insights.",
  },
  {
    question: "Can I edit the logo and colors after generation?",
    answer: "Absolutely! All generated assets are fully editable. You receive source files that you can modify in any design tool. We also provide multiple variations so you can choose what works best.",
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "We offer a 60-day money-back guarantee. If the report doesn't meet your expectations, simply contact our support team and we'll process a full refund — no questions asked.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes! We have a hassle-free 60-day refund policy. If you're not completely satisfied with your validation report and assets, we'll refund your purchase in full.",
  },
  {
    question: "Can I use the assets commercially?",
    answer: "Yes, all generated assets (logos, mockups, brand materials) are yours to use commercially without any restrictions. You have full ownership and licensing rights.",
  },
  {
    question: "Is my idea kept confidential?",
    answer: "Absolutely. Your idea and all submitted information are encrypted and never shared. We take confidentiality seriously and have strict data protection policies in place.",
  },
  {
    question: "Can I validate multiple ideas?",
    answer: "Each purchase validates one idea. If you want to validate multiple ideas, you can purchase additional reports at a discounted rate. Contact us for bulk pricing.",
  },
];

const PmsFaq = () => {
  return (
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
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
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
              <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline py-6 group">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-accent/50 group-hover:text-accent transition-colors">
                    0{index + 1}
                  </span>
                  <span>{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 pl-10">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 glass-premium rounded-2xl border border-accent/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to help you get started.
          </p>
          <a
            href="mailto:support@planningmysaas.com"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold underline underline-offset-4 transition-colors"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default PmsFaq;
