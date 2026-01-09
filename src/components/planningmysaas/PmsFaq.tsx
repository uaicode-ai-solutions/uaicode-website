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
    <section id="faq" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        {/* Section Header */}
        <div className="text-center mb-16">
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
              className="glass-card border border-border/50 rounded-xl px-6 data-[state=open]:border-accent/30"
            >
              <AccordionTrigger className="text-left text-foreground hover:text-accent hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still Have Questions */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:support@planningmysaas.com"
              className="text-accent hover:text-accent/80 font-semibold underline underline-offset-4"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PmsFaq;
