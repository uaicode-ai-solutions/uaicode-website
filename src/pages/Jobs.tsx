import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Globe, 
  Clock, 
  Rocket, 
  DollarSign, 
  TrendingUp, 
  Users, 
  MapPin, 
  FileText,
  ArrowRight,
  Code,
  Database,
  Workflow,
  Brain,
  Zap,
  Sparkles,
  Target,
  Laptop,
  CheckCircle2,
  UserCheck,
  CalendarClock
} from "lucide-react";

const Jobs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToPositions = () => {
    document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const benefits = [
    {
      icon: Globe,
      title: "Remote First",
      description: "Work from anywhere globally with flexible hours"
    },
    {
      icon: Rocket,
      title: "Rapid Development",
      description: "Launch MVPs in Weeks, Not Months"
    },
    {
      icon: Zap,
      title: "AI-Powered Tools",
      description: "Master Lovable, N8N, and Azure AI Foundry"
    },
    {
      icon: TrendingUp,
      title: "Real Impact",
      description: "Build products that generate actual revenue"
    }
  ];

  const allPositions = [
    {
      title: "Senior Developer",
      location: "Remote",
      type: "C2C Contract",
      description: "Lead client projects and technical architecture. Deliver production-ready MVPs that transform startup ideas into revenue-generating products in weeks, not months.",
      requirements: [
        "5+ years experience in web development",
        "Expert in React, TypeScript, and modern frameworks",
        "Experience with Supabase or Firebase",
        "Strong API design and integration skills",
        "Proven track record shipping MVPs"
      ],
      techStack: ["React", "TypeScript", "Lovable", "Supabase", "Node.js", "N8N", "API Integration"]
    },
    {
      title: "Customer Success Manager",
      location: "Remote",
      type: "C2C Contract",
      description: "Drive client onboarding, support, and retention. Build strong relationships with clients and identify upsell opportunities. Essential for active client relationship management.",
      requirements: [
        "3+ years in SaaS customer success",
        "Fluent in English and Portuguese",
        "Strong communication and relationship skills",
        "Experience with client onboarding and retention",
        "Data-driven approach to customer satisfaction"
      ],
      techStack: ["HubSpot", "Slack", "Project Management Tools", "CRM Systems"]
    },
    {
      title: "Marketing Assistant",
      location: "Remote",
      type: "C2C Contract",
      description: "Create compelling content, manage social media, and drive organic growth. Support our content strategy and scale content production for both owned products and client projects.",
      requirements: [
        "2+ years in digital marketing",
        "Strong content creation and copywriting skills",
        "Social media management experience",
        "Basic SEO knowledge",
        "Fluent in English and Portuguese"
      ],
      techStack: ["WordPress", "Canva", "Google Analytics", "Social Media Tools", "SEO Tools"]
    },
    {
      title: "Sales Manager",
      location: "Remote",
      type: "C2C Contract",
      description: "Drive revenue growth through strategic partnerships and client acquisition. Build sales pipeline and close deals with startups and SMBs seeking rapid MVP development.",
      requirements: [
        "3+ years B2B SaaS sales experience",
        "Proven track record closing deals",
        "Strong communication and negotiation skills",
        "Fluent in English and Portuguese",
        "Experience with CRM and sales tools"
      ],
      techStack: ["HubSpot", "LinkedIn Sales Navigator", "CRM Tools", "Sales Engagement Platforms"]
    },
    {
      title: "Junior Developer",
      location: "Remote",
      type: "C2C Contract",
      description: "Support senior developers on client projects. Write clean code, implement features, and learn rapid MVP development practices using AI-powered tools.",
      requirements: [
        "1-2 years web development experience",
        "Familiar with React and TypeScript",
        "Eager to learn and grow",
        "Basic API knowledge",
        "Strong problem-solving skills"
      ],
      techStack: ["React", "TypeScript", "Lovable", "Supabase", "Git", "Basic Node.js"]
    },
    {
      title: "Content Creator",
      location: "Remote",
      type: "C2C Contract",
      description: "Produce engaging video content, blog articles, and social media posts. Showcase our MVPs, client success stories, and technical tutorials to drive organic growth.",
      requirements: [
        "2+ years content creation experience",
        "Video editing skills",
        "Strong storytelling abilities",
        "SEO knowledge",
        "Fluent in English and Portuguese"
      ],
      techStack: ["Adobe Premiere/Final Cut", "Canva", "WordPress", "YouTube Studio", "Social Media Platforms"]
    },
    {
      title: "Operations Manager",
      location: "Remote",
      type: "C2C Contract",
      description: "Streamline internal processes, manage project workflows, and optimize team productivity. Ensure smooth delivery of client MVPs and maintain high service quality.",
      requirements: [
        "3+ years operations management experience",
        "Project management expertise",
        "Process optimization skills",
        "Data-driven decision making",
        "Strong organizational abilities"
      ],
      techStack: ["Notion", "Asana/Monday.com", "Google Workspace", "Process Automation Tools"]
    },
    {
      title: "AI/Automation Specialist",
      location: "Remote",
      type: "C2C Contract",
      description: "Design and implement AI-powered features and automation workflows for client MVPs. Integrate LLMs, build chatbots, and create intelligent automation using N8N and Azure AI.",
      requirements: [
        "2+ years AI/ML integration experience",
        "Experience with LLMs and APIs",
        "N8N workflow automation expertise",
        "Python and JavaScript knowledge",
        "Strong understanding of AI capabilities"
      ],
      techStack: ["N8N", "Azure AI Foundry", "OpenAI API", "Python", "JavaScript", "Zapier/Make"]
    },
    {
      title: "Business Development",
      location: "Remote",
      type: "C2C Contract",
      description: "Identify strategic partnerships, explore new market opportunities, and expand UaiCode's service offerings. Build relationships with technology partners and potential clients.",
      requirements: [
        "3+ years business development experience",
        "Strong networking skills",
        "Strategic thinking abilities",
        "Experience in tech/SaaS industry",
        "Fluent in English and Portuguese"
      ],
      techStack: ["LinkedIn", "CRM Systems", "Google Workspace", "Market Research Tools"]
    }
  ];

  const applicationSteps = [
    {
      icon: FileText,
      title: "Apply",
      description: "Submit your application via LinkedIn"
    },
    {
      icon: UserCheck,
      title: "Interview",
      description: "Virtual interview with our team"
    },
    {
      icon: Target,
      title: "Assessment",
      description: "Technical challenge or case study"
    },
    {
      icon: CheckCircle2,
      title: "Offer",
      description: "Receive offer and onboard"
    }
  ];

  const perks = [
    { icon: Laptop, label: "Remote Work" },
    { icon: Clock, label: "Flexible Hours" },
    { icon: Globe, label: "Global Team" },
    { icon: Rocket, label: "Fast-Paced" }
  ];

  const techStack = [
    {
      name: "Lovable",
      category: "AI-Powered Development",
      color: "from-purple-500 to-pink-500",
      description: "AI-powered code generation and rapid prototyping platform that turns ideas into production-ready React applications in hours, not weeks.",
      role: "Frontend Development & UI/UX",
      speed: "10x faster than traditional coding",
      icon: Code
    },
    {
      name: "Supabase",
      category: "Backend-as-a-Service",
      color: "from-green-500 to-emerald-500",
      description: "Open-source Firebase alternative providing instant database, authentication, storage, and real-time subscriptions without DevOps overhead.",
      role: "Backend Infrastructure & Database",
      speed: "Zero server setup",
      icon: Database
    },
    {
      name: "N8N",
      category: "Workflow Automation",
      color: "from-orange-500 to-red-500",
      description: "Fair-code workflow automation tool that connects apps, APIs, and AI models to create powerful integrations and business logic without code.",
      role: "Process Automation & Integration",
      speed: "Automate in minutes",
      icon: Workflow
    },
    {
      name: "Azure AI Foundry",
      category: "Enterprise AI Platform",
      color: "from-blue-500 to-cyan-500",
      description: "Microsoft's unified AI platform providing LLMs, cognitive services, and ML tools for building intelligent applications at scale.",
      role: "AI/ML Integration & Intelligence",
      speed: "Enterprise-grade AI",
      icon: Brain
    }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
      
      {/* Hero Section */}
      <section className="pt-[240px] pb-20 px-4 bg-gradient-to-b from-background via-card/50 to-background">
        <div className="container mx-auto max-w-4xl text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Join Uaicode's<br />
            <span className="text-gradient-gold">Global Remote Team</span>
          </h1>
          
          <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
            Help us transform startup ideas into revenue-generating products using cutting-edge AI and rapid development frameworks.
          </p>
          
          <div className="flex justify-center mb-8">
            <Badge className="glass-card px-6 py-3 text-base border-accent/20">
              <Globe className="w-4 h-4 mr-2" />
              Remote-First • C2C Contracts
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg"
              onClick={scrollToPositions}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 glow-white"
            >
              <Rocket className="w-5 h-5 mr-2" />
              View Open Positions
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('process')}
              className="border-accent hover:bg-accent hover:text-accent-foreground font-semibold text-lg px-8 py-6"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Application Process
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-muted-foreground">
            <div className="flex items-center gap-2 hover-scale">
              <Clock className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Rapid MVP Launches</span>
            </div>
            <div className="flex items-center gap-2 hover-scale">
              <Globe className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">Global Team</span>
            </div>
            <div className="flex items-center gap-2 hover-scale">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join UaiCode Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Join <span className="text-gradient-gold">UaiCode</span>?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="glass-card hover-lift animate-fade-in-up border-accent/10 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 icon-gradient mx-auto">
                    <benefit.icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map((perk, index) => (
              <div 
                key={index}
                className="glass-card p-6 text-center hover-lift animate-fade-in-up border-accent/10"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <perk.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">{perk.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Showcase Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient-gold">Tech Stack</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge tools that enable rapid MVP launches
            </p>
          </div>

          {/* Tech Stack Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Card 
                      className="glass-card hover-lift cursor-pointer animate-fade-in-up border-accent/10 relative overflow-hidden group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Gradient Background Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      
                      <CardHeader className="relative z-10">
                        {/* Icon Container with Gradient */}
                        <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                          <IconComponent className="w-8 h-8 text-accent" />
                        </div>
                        
                        <CardTitle className="text-xl text-center">{tech.name}</CardTitle>
                        <Badge variant="secondary" className="bg-accent/10 mx-auto mt-2 text-xs">
                          {tech.category}
                        </Badge>
                      </CardHeader>
                      
                      <CardContent className="relative z-10 text-center">
                        <p className="text-sm text-muted-foreground mb-2">{tech.role}</p>
                        <Badge className="bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          {tech.speed}
                        </Badge>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  
                  <TooltipContent 
                    side="bottom" 
                    className="max-w-xs p-4 glass-card border-accent/20"
                  >
                    <p className="text-sm leading-relaxed">{tech.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Horizontal Scroll - Tools Animation */}
          <div className="relative overflow-hidden mt-12">
            <div className="flex gap-8 animate-scroll">
              {[...techStack, ...techStack, ...techStack].map((tech, index) => (
                <div 
                  key={index}
                  className="glass-card px-8 py-4 rounded-lg whitespace-nowrap hover-lift flex-shrink-0 border-accent/10"
                >
                  <span className="text-lg font-semibold">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section id="process" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Application <span className="text-gradient-gold">Process</span>
            </h2>
            <p className="text-xl text-muted-foreground">Simple, transparent, and fast</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {applicationSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card 
                  className="glass-card hover-lift animate-fade-in-up border-accent/10 text-center h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                      <step.icon className="w-8 h-8 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < applicationSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-7 transform -translate-y-1/2 w-6 h-6 text-accent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Job Positions Section */}
      <section id="positions" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Open <span className="text-gradient-gold">Positions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our remote team and build the future of rapid MVP development
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {allPositions.map((position, index) => (
              <Card 
                key={index}
                className="glass-card hover-lift animate-fade-in-up border-accent/10 h-full flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{position.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {position.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {position.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Requirements:</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {position.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {position.techStack.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="bg-accent/10 text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    asChild
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold glow-white"
                  >
                    <a 
                      href="https://www.linkedin.com/company/uaicodeai/jobs" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>


      <Footer />
      </div>
    </TooltipProvider>
  );
};

export default Jobs;
