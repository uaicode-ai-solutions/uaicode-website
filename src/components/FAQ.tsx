import { useState } from "react";
import { 
  Search,
  Lightbulb,
  DollarSign,
  Clock,
  GitBranch,
  Sparkles,
  Headphones,
  Code2,
  ShieldCheck,
  Target,
  Megaphone,
  BadgeDollarSign,
  LucideIcon
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface FAQQuestion {
  icon: LucideIcon;
  question: string;
  answer: string;
}

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openValue, setOpenValue] = useState<string>("");
  const navigate = useNavigate();


  const faqCategories = [
    {
      category: "",
      questions: [
        {
          icon: Target,
          question: "How do I know if my idea is worth building?",
          answer: "That is exactly what the free strategy call is for. In 45 minutes, our founder runs a live AI-powered market analysis of your SaaS idea — viability score, competitor landscape, financial projections. Once validated, we map out the development partnership to build, launch, and grow your product together.",
        },
        {
          icon: Lightbulb,
          question: "What is an MVP and why do I need one?",
          answer: "An MVP (Minimum Viable Product) is a lean version of your product with core features that solve your target audience's main problem. It allows you to test your concept, gather user feedback, and validate market demand before investing heavily in full development. With an MVP, you can launch faster, reduce risk, and iterate based on real user data. At Uaicode, we validate your SaaS idea first, then build and launch your MVP as your dedicated development partner.",
        },
        {
          icon: DollarSign,
          question: "How much does an MVP typically cost?",
          answer: "Our MVP packages vary depending on complexity, features, and timeline. Every package includes a Marketing Launch Plan (branding, brand manual, landing page, paid media strategy, and 8-12 ad creatives). The Starter MVP is perfect for basic concepts, the Growth MVP includes advanced features and AI automation, and the Enterprise MVP offers full-stack solutions with custom AI models. Check our pricing section for current ranges, or book a free strategy call for a personalized quote.",
        },
        {
          icon: Clock,
          question: "How long does it take to build an MVP?",
          answer: "Our typical MVP development timeline ranges from 6-18 weeks depending on complexity and package tier. Our AI-driven development process significantly accelerates traditional timelines while maintaining high quality.",
        },
        {
          icon: GitBranch,
          question: "What is your development process?",
          answer: "We follow a streamlined 4-step partnership process: 1) Free Strategy Call — 45-minute SaaS validation with AI, 2) Design & Develop — we build your SaaS MVP as your partner, 3) Launch & Iterate — we launch and iterate together, and 4) Grow & Optimize — ongoing partnership for scaling your SaaS business. Each step is collaborative and transparent.",
        },
        {
          icon: Sparkles,
          question: "What kind of AI features can you integrate?",
          answer: "We can integrate a wide range of AI capabilities including natural language processing, predictive analytics, automated workflows, intelligent recommendations, chatbots, computer vision, and custom machine learning models. Our team stays current with the latest AI technologies and can recommend the best solutions for your specific use case.",
        },
        {
          icon: Headphones,
          question: "Do you offer post-launch support?",
          answer: "Yes! All our packages include post-launch priority support: 45 days for Starter, 90 days for Growth, and 120 days for Enterprise. Priority support includes bug fixes, performance monitoring, feature enhancements, technical guidance, and monitoring of your marketing campaign metrics. After the included support period ends, you can extend your partnership on a monthly basis — we continue evolving both your SaaS product and marketing strategy together, ensuring constant growth and success.",
        },
        {
          icon: Code2,
          question: "What technologies do you use?",
          answer: "We use modern, scalable technologies tailored to your needs. Our typical stack includes React/Next.js for frontend, Node.js/Python for backend, PostgreSQL/MongoDB for databases, and leading AI frameworks like OpenAI, TensorFlow, or custom models. We select technologies based on your specific requirements, scalability needs, and budget.",
        },
        {
          icon: ShieldCheck,
          question: "Will I own the code and intellectual property?",
          answer: "Absolutely! You retain full ownership of all code, design assets, and intellectual property we create for your project. Upon final payment and project completion, we transfer all rights to you, ensuring you have complete control over your product's future.",
        },
        {
          icon: Megaphone,
          question: "What is the Marketing Launch Plan?",
          answer: "Every package includes a complete Marketing Launch Plan to ensure your SaaS launches with a professional go-to-market strategy. This includes branding and brand identity, a brand manual, an optimized landing page, a paid media strategy, and 8 to 12 ad creatives ready for campaigns. This is included in all tiers — Starter, Growth, and Enterprise.",
        },
        {
          icon: BadgeDollarSign,
          question: "Do I need to pay for ads separately?",
          answer: "Yes. The ads budget (the amount spent on platforms like Google Ads, Meta Ads, LinkedIn Ads, etc.) is always paid directly to the media platforms — not to Uaicode. Our Marketing Launch Plan includes the strategy, creatives, and a recommended ads budget based on your market and goals, but the actual ad spend is your investment and is separate from our packages. We provide a recommendation, but the final budget is always your decision.",
        },
      ]
    },
  ];

  const allFaqs = faqCategories.flatMap(cat => 
    cat.questions.map(q => ({ ...q, category: cat.category }))
  );

  const filteredFaqs = allFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedFaqs = searchTerm 
    ? [{ category: "Search Results", questions: filteredFaqs }]
    : faqCategories;

  return (
    <section className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Got Questions? <span className="text-gradient-gold">We Have Answers</span></h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything SaaS founders ask before they validate and build with us
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-6 text-lg bg-card border-accent/20 focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {groupedFaqs.map((categoryGroup, catIndex) => (
                <div key={catIndex}>
                  <Accordion 
                    type="single" 
                    collapsible 
                    className="space-y-3"
                    value={openValue}
                    onValueChange={setOpenValue}
                  >
                    {categoryGroup.questions.map((faq, index) => (
                      <AccordionItem 
                        key={`${catIndex}-${index}`} 
                        value={`item-${catIndex}-${index}`}
                        className={cn(
                          "glass-card px-6 rounded-xl border-2 transition-all duration-500 ease-in-out",
                          openValue === `item-${catIndex}-${index}` 
                            ? "border-accent shadow-[0_0_20px_rgba(255,190,20,0.3)]" 
                            : "border-transparent hover:border-accent hover:shadow-[0_0_20px_rgba(255,190,20,0.2)]"
                        )}
                      >
                        <AccordionTrigger 
                          className={cn(
                            "py-3 text-left text-base font-semibold transition-all duration-500",
                            "hover:text-accent hover:no-underline hover:scale-100",
                            openValue === `item-${catIndex}-${index}`
                              ? "text-accent"
                              : "text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <faq.icon 
                              className={cn(
                                "w-5 h-5 flex-shrink-0 transition-colors duration-500",
                                openValue === `item-${catIndex}-${index}`
                                  ? "text-accent"
                                  : "text-muted-foreground"
                              )}
                            />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-2xl text-center">
              <p className="text-xl text-muted-foreground mb-4">No questions found matching your search.</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Still have questions?</p>
          <Button
            size="lg"
            onClick={() => window.open("https://uaicode.ai/booking", "_blank")}
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 glow-white"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Book My Free Strategy Call
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
