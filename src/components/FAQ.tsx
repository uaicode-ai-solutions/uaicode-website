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
          answer: "That's exactly what our free Planning My SaaS tool is for! It gives you instant AI-powered market analysis, competitor insights, and a viability score. In just 5 minutes, you'll know if your idea has real potential before investing in development. Most founders who use it avoid costly mistakes and discover valuable market opportunities they hadn't considered.",
        },
        {
          icon: Lightbulb,
          question: "What is an MVP and why do I need one?",
          answer: "An MVP (Minimum Viable Product) is a lean version of your product with core features that solve your target audience's main problem. It allows you to test your concept, gather user feedback, and validate market demand before investing heavily in full development. With an MVP, you can launch faster, reduce risk, and iterate based on real user data.",
        },
        {
          icon: DollarSign,
          question: "How much does an MVP typically cost?",
          answer: "Our MVP packages range from $10,000 to $160,000, depending on complexity, features, and timeline. The Starter MVP ($10,000-$25,000) is perfect for basic concepts, the Growth MVP ($25,000-$60,000) includes advanced features and AI automation, and the Enterprise MVP ($60,000-$160,000) offers full-stack solutions with custom AI models. We recommend starting with our free validation tool to ensure your idea is ready for development.",
        },
        {
          icon: Clock,
          question: "How long does it take to build an MVP?",
          answer: "Our typical MVP development timeline ranges from 6-18 weeks depending on complexity and package tier. Our AI-driven development process significantly accelerates traditional timelines while maintaining high quality.",
        },
        {
          icon: GitBranch,
          question: "What is your development process?",
          answer: "We follow a streamlined 4-step process: 1) Validate with AI - start with our free Planning My SaaS tool for market analysis, 2) Design & Develop - rapid MVP creation using AI-driven tools, 3) Launch & Iterate - go-to-market strategy and deployment, and 4) Grow & Optimize - post-launch support and feature expansion. Each step is collaborative and transparent.",
        },
        {
          icon: Sparkles,
          question: "What kind of AI features can you integrate?",
          answer: "We can integrate a wide range of AI capabilities including natural language processing, predictive analytics, automated workflows, intelligent recommendations, chatbots, computer vision, and custom machine learning models. Our team stays current with the latest AI technologies and can recommend the best solutions for your specific use case.",
        },
        {
          icon: Headphones,
          question: "Do you offer post-launch support?",
          answer: "Yes! All our packages include post-launch support: 45 days for Starter, 90 days for Growth, and 120 days of priority support for Enterprise. This includes bug fixes, performance monitoring, feature enhancements, and technical guidance. We also offer extended maintenance packages and partnership models for ongoing development.",
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
            Everything you need to know about validation and MVP development
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
            onClick={() => navigate("/planningmysaas")}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 glow-white"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Validate Your Idea First
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
