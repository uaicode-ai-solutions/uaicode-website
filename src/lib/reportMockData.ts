// ============================================
// REPORT DATA - English Version
// ============================================

// ==========================================
// REPORT DATA (Viability Report Tab)
// ==========================================

export const reportData = {
  // Hero Section
  projectName: "My Doctor Hub",
  viabilityScore: 87,
  verdictHeadline: "High viability, your idea has real traction potential — time to turn vision into product.",
  keyMetrics: {
    marketSize: "$12.4B",
    marketLabel: "Total Market",
    expectedROI: "363%",
    roiLabel: "Expected ROI",
    paybackMonths: 8,
    paybackLabel: "Months to Payback"
  },

  // Executive Verdict
  executiveSummary: `After deeply analyzing your My Doctor Hub project, we identified a solid opportunity in a $12.4 billion market growing at 23% per year.

Your unique approach of connecting consumers with local health product and supplement suppliers, combined with inventory management and delivery, positions you favorably against competitors who focus only on large chains.

The estimated $55,000 MVP investment has the potential to break even in 8 months, with an LTV/CAC of 11.5x indicating extremely healthy unit economics.`,
  
  recommendation: "Proceed with development",
  
  highlights: [
    { 
      icon: "TrendingUp", 
      text: "Market growing 23% year-over-year",
      detail: "Healthcare e-commerce is one of the fastest-growing sectors" 
    },
    { 
      icon: "PiggyBank", 
      text: "Favorable unit economics (LTV/CAC 11.5x)",
      detail: "Financial indicators above market average" 
    },
    { 
      icon: "Target", 
      text: "Low competition in small business niche",
      detail: "Competitors focus on large chains, neglecting SMBs" 
    },
    { 
      icon: "Clock", 
      text: "Technically viable in 4-6 months",
      detail: "Modern stack enables agile development" 
    },
  ],
  
  risks: [
    { 
      risk: "Dependency on third-party APIs for payments and delivery",
      priority: "medium" as const,
      mitigation: "We implement multi-provider fallbacks and intelligent caching" 
    },
    { 
      risk: "Longer sales cycle for small businesses",
      priority: "medium" as const,
      mitigation: "PLG approach with freemium reduces adoption friction" 
    },
    { 
      risk: "Health and functional food regulations",
      priority: "low" as const,
      mitigation: "Compliance integrated from day 1 with FDA validations" 
    },
  ],

  // Market Opportunity
  market: {
    tam: { value: "$12.4B", label: "TAM", description: "Total Addressable Market - Global Healthcare E-commerce" },
    sam: { value: "$2.8B", label: "SAM", description: "Serviceable Available Market - US/LATAM Segment" },
    som: { value: "$180M", label: "SOM", description: "Serviceable Obtainable Market - First 3 years" },
    growthRate: "23%",
    growthLabel: "Annual Growth",
    conclusion: "There is clear room for a new player focused on small health and wellness businesses in the Americas."
  },
  
  competitors: [
    { 
      name: "DoorDash/Instacart", 
      price: "15-25% Commission", 
      weakness: "Focused on general food, no health specialization",
      yourAdvantage: "Specialization in health products with compliance"
    },
    { 
      name: "Online Pharmacies", 
      price: "Fixed margin", 
      weakness: "Only large chains, no support for small businesses",
      yourAdvantage: "Platform for small producers and stores"
    },
    { 
      name: "Generic ERPs", 
      price: "$50-200/month", 
      weakness: "No integrated delivery, steep learning curve",
      yourAdvantage: "Complete and easy-to-use solution"
    },
  ],
  
  competitiveAdvantage: "The only platform that combines inventory management, local delivery, and health product compliance, focused on small businesses.",

  // Investment
  investment: {
    total: 55000,
    currency: "USD",
    breakdown: [
      { name: "Frontend Development", value: 18000, percentage: 33 },
      { name: "Backend & API", value: 15000, percentage: 27 },
      { name: "Integrations (Payment, Delivery)", value: 12000, percentage: 22 },
      { name: "Infrastructure (12 months)", value: 5000, percentage: 9 },
      { name: "Testing & QA", value: 5000, percentage: 9 },
    ],
    included: [
      "Complete MVP development",
      "12 months of hosting and infrastructure",
      "Payment and delivery integrations",
      "Responsive web app (mobile-first)",
      "Post-launch support (30 days)",
      "Complete technical documentation",
    ],
    notIncluded: [
      "Marketing and customer acquisition",
      "Native iOS/Android apps",
      "Additional custom integrations",
      "24/7 support after initial period",
    ],
    comparison: {
      traditional: 120000,
      savings: "54%",
      note: "Traditional agency would charge $120,000+ for the same scope"
    }
  },

  // Financial Return
  financials: {
    breakEvenMonths: 8,
    roiYear1: 363,
    mrrMonth12: 69420,
    arrProjected: 833000,
    ltvCacRatio: 11.5,
    monthlyChurn: "5%",
    
    unitEconomics: {
      idealTicket: 33,
      paybackPeriod: 4.5,
      ltv: 792,
      ltvMonths: 24,
      cac: 150,
      ltvCacRatio: 5.3,
      howItWorks: "You invest $150 once to acquire a customer (CAC). They pay $33/month for an average of 24 months, generating $792 in total revenue (LTV). You recover your acquisition cost in 4.5 months, then profit for the remaining 19.5 months. This is a healthy business model with strong unit economics."
    },
    
    scenarios: [
      { 
        name: "Conservative", 
        mrrMonth12: 45000, 
        arrYear1: 540000,
        breakEven: 11,
        probability: "70%"
      },
      { 
        name: "Realistic", 
        mrrMonth12: 69420, 
        arrYear1: 833000,
        breakEven: 8,
        probability: "60%"
      },
      { 
        name: "Optimistic", 
        mrrMonth12: 95000, 
        arrYear1: 1140000,
        breakEven: 6,
        probability: "40%"
      },
    ],
    
    projectionData: [
      { month: "M1", revenue: 890, costs: 18500, cumulative: -17610 },
      { month: "M2", revenue: 2670, costs: 12500, cumulative: -27440 },
      { month: "M3", revenue: 5340, costs: 12500, cumulative: -34600 },
      { month: "M4", revenue: 8900, costs: 12500, cumulative: -38200 },
      { month: "M5", revenue: 13350, costs: 12500, cumulative: -37350 },
      { month: "M6", revenue: 18690, costs: 13000, cumulative: -31660 },
      { month: "M7", revenue: 24920, costs: 13000, cumulative: -19740 },
      { month: "M8", revenue: 32040, costs: 13500, cumulative: -1200 },
      { month: "M9", revenue: 40050, costs: 14000, cumulative: 24850 },
      { month: "M10", revenue: 48950, costs: 14000, cumulative: 59800 },
      { month: "M11", revenue: 58740, costs: 14500, cumulative: 104040 },
      { month: "M12", revenue: 69420, costs: 15000, cumulative: 158460 },
    ]
  },

  // Execution Plan
  timeline: [
    { 
      phase: 1,
      name: "Discovery", 
      duration: "2-3 weeks",
      description: "Requirements refinement and architecture",
      deliverables: ["Complete PRD", "Wireframes", "Technical architecture", "Detailed timeline"],
      icon: "Search"
    },
    { 
      phase: 2,
      name: "MVP Build", 
      duration: "10-14 weeks",
      description: "Core feature development",
      deliverables: ["Auth & users", "Product management", "Cart & orders", "Integrations"],
      icon: "Code"
    },
    { 
      phase: 3,
      name: "Beta", 
      duration: "4-6 weeks",
      description: "Real user testing and iterations",
      deliverables: ["Beta user onboarding", "Feedback collection", "Fixes & improvements", "Documentation"],
      icon: "Users"
    },
    { 
      phase: 4,
      name: "Launch", 
      duration: "2 weeks",
      description: "Public launch and go-to-market",
      deliverables: ["Production deploy", "Active marketing", "Customer support", "Monitoring"],
      icon: "Rocket"
    },
  ],
  
  techStack: [
    { category: "Frontend", techs: ["React 18", "TypeScript", "TailwindCSS"] },
    { category: "Backend", techs: ["Node.js", "PostgreSQL", "Supabase"] },
    { category: "Infra", techs: ["Vercel", "AWS", "Docker"] },
    { category: "Integrations", techs: ["Stripe", "Delivery API", "SendGrid"] },
  ],

  // Why Uaicode
  uaicode: {
    successRate: 94,
    projectsDelivered: 47,
    avgDeliveryWeeks: 12,
    
    differentials: [
      { 
        icon: "Award", 
        title: "94% Success Rate", 
        description: "Projects delivered successfully on time and budget" 
      },
      { 
        icon: "Users", 
        title: "SaaS-Specialized Team", 
        description: "Senior developers focused on digital products" 
      },
      { 
        icon: "Zap", 
        title: "Agile Methodology", 
        description: "Weekly deliveries with demos and transparent communication" 
      },
      { 
        icon: "HeadphonesIcon", 
        title: "Post-Launch Support", 
        description: "30 days of support included after go-live" 
      },
    ],
    
    testimonials: [
      { 
        name: "Carlos Oliveira", 
        company: "FinTech Solutions", 
        avatar: "/testimonial-carlos.webp",
        quote: "Uaicode delivered our MVP in 12 weeks with quality that exceeded expectations. Highly recommend.",
        role: "CEO"
      },
      { 
        name: "Maria Santos", 
        company: "HealthTech Co", 
        avatar: "/testimonial-maria.webp",
        quote: "Professional, agile, and transparent. Exactly what we needed to bring our idea to life.",
        role: "Founder"
      },
    ],
    
    guarantees: [
      "Weekly demos for progress tracking",
      "Fixed price for MVP scope",
      "30 days post-launch support",
      "100% ownership of source code",
      "Complete documentation",
    ],
  },

  // Next Steps
  nextSteps: {
    verdictSummary: "Your project is ready to be built.",
    
    steps: [
      { 
        step: 1, 
        title: "Kickoff Meeting", 
        description: "1 hour to align expectations and define priorities",
        icon: "Calendar"
      },
      { 
        step: 2, 
        title: "Proposal & Contract", 
        description: "Clear documentation with scope, timeline, and investment",
        icon: "FileText"
      },
      { 
        step: 3, 
        title: "Start in 5 Business Days", 
        description: "We begin the project right after approval",
        icon: "PlayCircle"
      },
      { 
        step: 4, 
        title: "First Delivery in 2 Weeks", 
        description: "You'll see real progress quickly",
        icon: "Package"
      },
    ],
    
    cta: {
      primary: "Schedule a Call",
      secondary: "Download PDF Report",
    },
    
    contact: {
      email: "contact@uaicode.dev",
      whatsapp: "+1 (555) 123-4567",
      calendly: "https://calendly.com/uaicode",
    }
  }
};

// ==========================================
// ASSETS DATA (Brand Assets Tab)
// ==========================================

export const assetsData = {
  // Screen Mockups
  screenMockups: [
    {
      name: "Main Dashboard",
      description: "Overview with metrics, recent orders, and stock alerts",
      category: "Desktop",
      features: ["Real-time KPIs", "Sales charts", "Smart alerts", "Quick actions"],
      priority: "Core"
    },
    {
      name: "Product Catalog",
      description: "Complete product management with categories and variations",
      category: "Desktop",
      features: ["Grid/List view", "Advanced filters", "Bulk actions", "Import/Export"],
      priority: "Core"
    },
    {
      name: "Order Management",
      description: "Complete order flow with status and tracking",
      category: "Desktop",
      features: ["Visual pipeline", "Order details", "Customer history", "Communication"],
      priority: "Core"
    },
    {
      name: "Customer App",
      description: "Customer interface to search and buy products",
      category: "Mobile",
      features: ["Smart search", "Cart", "Checkout", "Tracking"],
      priority: "Core"
    },
    {
      name: "Inventory Control",
      description: "Inventory with alerts and automatic replenishment",
      category: "Desktop",
      features: ["Stock levels", "Low-stock alerts", "History", "Suppliers"],
      priority: "Secondary"
    },
    {
      name: "Reports",
      description: "Analytics and performance reports",
      category: "Desktop",
      features: ["Sales", "Products", "Customers", "Export"],
      priority: "Secondary"
    },
    {
      name: "Login & Onboarding",
      description: "Authentication flow and initial setup",
      category: "Mobile",
      features: ["Social login", "Setup wizard", "Verification", "Guided tour"],
      priority: "Core"
    },
    {
      name: "Settings",
      description: "Store settings, integrations, and profile",
      category: "Desktop",
      features: ["Store data", "Payments", "Delivery", "Notifications"],
      priority: "Secondary"
    },
  ],

  // Brand Copy
  brandCopy: {
    brandName: "My Doctor Hub",
    
    valueProposition: "Simplify your health business management with a complete platform for inventory, sales, and delivery.",
    
    voiceTone: {
      primary: "Professional and approachable",
      characteristics: [
        { trait: "Trustworthy", description: "We convey security and expertise in the sector" },
        { trait: "Simple", description: "Clear communication, no technical jargon" },
        { trait: "Empathetic", description: "We understand the challenges of small entrepreneurs" },
        { trait: "Innovative", description: "Modern solutions for real problems" },
      ],
    },
    
    taglines: [
      { text: "Health within everyone's reach", usage: "Primary", context: "Hero, campaigns" },
      { text: "Your health business, simplified", usage: "Secondary", context: "Features, social" },
      { text: "From inventory to customer, all in one place", usage: "Descriptive", context: "Explanations" },
    ],
    
    elevatorPitch: "My Doctor Hub is the complete platform for small health and wellness businesses to manage inventory, sales, and delivery in one place. Unlike generic ERPs or delivery apps, we combine intelligent management with health product compliance, helping entrepreneurs sell more with less effort.",
    
    keyMessages: [
      { 
        message: "Smart inventory management prevents losses and stockouts", 
        audience: "Store owners", 
        proof: "Automatic replenishment alerts" 
      },
      { 
        message: "Integrated delivery expands your reach without complications", 
        audience: "Small producers", 
        proof: "Integration with major apps" 
      },
      { 
        message: "Simplified compliance for health products", 
        audience: "All", 
        proof: "Automated FDA validations" 
      },
    ],
    
    ctaExamples: [
      { cta: "Start for Free", context: "Landing page hero" },
      { cta: "See Demo", context: "Features page" },
      { cta: "Talk to an Expert", context: "Enterprise/questions" },
      { cta: "Schedule a Demo", context: "B2B" },
    ],
  },

  // Brand Identity
  brandIdentity: {
    colorPalette: [
      { 
        name: "Primary", 
        hex: "#10B981", 
        hsl: "160, 84%, 39%", 
        usage: "CTAs, main elements, success",
        role: "Main color - conveys health and trust"
      },
      { 
        name: "Secondary", 
        hex: "#1E293B", 
        hsl: "217, 33%, 17%", 
        usage: "Text, dark backgrounds",
        role: "Support color - professionalism"
      },
      { 
        name: "Accent", 
        hex: "#3B82F6", 
        hsl: "217, 91%, 60%", 
        usage: "Links, interactive elements",
        role: "Highlight - technology and innovation"
      },
      { 
        name: "Background", 
        hex: "#F8FAFC", 
        hsl: "210, 40%, 98%", 
        usage: "Light backgrounds",
        role: "Base - lightness and cleanliness"
      },
      { 
        name: "Success", 
        hex: "#22C55E", 
        hsl: "142, 71%, 45%", 
        usage: "Confirmations, positive status",
        role: "Positive feedback"
      },
      { 
        name: "Warning", 
        hex: "#F59E0B", 
        hsl: "38, 92%, 50%", 
        usage: "Alerts, attention",
        role: "Attention feedback"
      },
    ],
    
    typography: {
      headings: { font: "Inter", weight: "700", fallback: "system-ui, sans-serif" },
      body: { font: "Inter", weight: "400", fallback: "system-ui, sans-serif" },
      accent: { font: "Inter", weight: "600", fallback: "system-ui, sans-serif" },
      scale: [
        { name: "Display", size: "3rem", usage: "Main titles" },
        { name: "H1", size: "2.25rem", usage: "Page titles" },
        { name: "H2", size: "1.875rem", usage: "Sections" },
        { name: "H3", size: "1.5rem", usage: "Subsections" },
        { name: "Body", size: "1rem", usage: "Main text" },
        { name: "Small", size: "0.875rem", usage: "Labels, captions" },
      ],
    },
    
    logoUsage: {
      minSize: "32px height",
      clearSpace: "Equal to the height of the letter 'M' in the logo",
      backgrounds: ["Works on dark backgrounds (preferred)", "Light version for light backgrounds"],
      donts: ["Don't distort", "Don't change colors", "Don't add effects", "Don't rotate"],
    },
    
    spacing: {
      base: "4px",
      scale: ["4px", "8px", "12px", "16px", "24px", "32px", "48px", "64px"],
      containerMax: "1280px",
    },
    
    borderRadius: {
      small: "4px",
      medium: "8px",
      large: "12px",
      full: "9999px",
    },
  },

  // Logo Suggestions
  logos: [
    {
      variant: "Full Color",
      description: "Complete logo with symbol and wordmark in color",
      usage: "Website, marketing materials, presentations",
      preview: "gradient",
      colors: { primary: "#10B981", secondary: "#1E293B" }
    },
    {
      variant: "Icon Only",
      description: "Symbol only, no text",
      usage: "Favicon, app icon, small spaces, social media",
      preview: "icon",
      colors: { primary: "#10B981" }
    },
    {
      variant: "Light Mode",
      description: "Version for light backgrounds",
      usage: "Print materials, white backgrounds",
      preview: "light",
      colors: { primary: "#1E293B", secondary: "#10B981" }
    },
    {
      variant: "Dark Mode",
      description: "Version for dark backgrounds",
      usage: "Dark headers, night mode, overlays",
      preview: "dark",
      colors: { primary: "#FFFFFF", secondary: "#10B981" }
    },
  ],

  // Landing Page
  landingPage: {
    sections: [
      { 
        name: "Hero", 
        description: "Headline, value proposition, main CTA, and product image/video",
        keyElements: ["Impactful headline", "Benefit-focused subheadline", "CTA above the fold", "Quick social proof"]
      },
      { 
        name: "Problems", 
        description: "3 main pain points the product solves",
        keyElements: ["Visual icons", "Empathetic copy", "Emotional connection"]
      },
      { 
        name: "Solution", 
        description: "How the product solves each problem",
        keyElements: ["Product screenshots", "Clear benefits", "Competitive differentiator"]
      },
      { 
        name: "Features", 
        description: "Main features highlighted",
        keyElements: ["Feature grid", "Icons", "Short descriptions"]
      },
      { 
        name: "Testimonials", 
        description: "Social proof with real customers",
        keyElements: ["Customer photos", "Impactful quotes", "Company logos"]
      },
      { 
        name: "Pricing", 
        description: "Transparent plans and pricing",
        keyElements: ["Plan comparison", "CTA per plan", "Popular plan highlight"]
      },
      { 
        name: "FAQ", 
        description: "Frequently asked questions",
        keyElements: ["Accordion format", "Common objections", "Support link"]
      },
      { 
        name: "Final CTA", 
        description: "Final call to action",
        keyElements: ["Subtle urgency", "Main CTA", "Secondary option"]
      },
    ],
    
    conversionElements: [
      "CTA visible above the fold",
      "Social proof near CTAs",
      "Mobile-first design",
      "Fast loading (<3s)",
      "Chat widget for questions",
      "Exit-intent popup (optional)",
    ],
    
    downloadNote: "Complete landing page template included in the download package. Customize with your colors, copy, and images."
  },

  // Mockup Previews (additional assets)
  mockupPreviews: [
    { type: "Business Cards", description: "Professional front and back", specs: "3.5\" x 2\", 350gsm" },
    { type: "Social Media Kit", description: "Profile, cover, and post templates", specs: "LinkedIn, Instagram, Facebook" },
    { type: "App Icon", description: "Icons for iOS and Android", specs: "1024x1024 master + all sizes" },
    { type: "Email Signature", description: "HTML signature with logo", specs: "600px, light/dark versions" },
    { type: "Presentation", description: "Slide template", specs: "16:9, Google Slides and PowerPoint" },
  ],
};
