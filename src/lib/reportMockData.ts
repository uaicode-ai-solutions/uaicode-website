// ============================================
// REPORT DATA - English Version
// ============================================

import sarahJohnsonAvatar from "@/assets/testimonial-sarah-johnson.webp";
import marcusAvatar from "@/assets/author-marcus.webp";

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

The estimated $60,500 MVP investment has the potential to break even in 8 months, with an LTV/CAC of 11.5x indicating extremely healthy unit economics.`,
  
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
      name: "DoorDash Health", 
      description: "Delivery platform with health and wellness vertical, focused on large chains and pharmacies with same-day delivery.",
      price: 39,
      priceModel: "tiered",
      targetMarket: "All",
      weakness: "Focused on general food, no health specialization",
      yourAdvantage: "Specialization in health products with compliance"
    },
    { 
      name: "Instacart Rx", 
      description: "Pharmacy and health product delivery service integrated with Instacart, focused on mid-market retailers.",
      price: 39,
      priceModel: "tiered",
      targetMarket: "Mid-Market",
      weakness: "Only large chains, no support for small businesses",
      yourAdvantage: "Platform for small producers and stores"
    },
    { 
      name: "Amazon Pharmacy", 
      description: "Amazon's pharmacy service with Prime delivery, offering prescription management and OTC products.",
      price: 39,
      priceModel: "tiered",
      targetMarket: "SMB",
      weakness: "Complex onboarding, not SMB friendly",
      yourAdvantage: "Simple setup in minutes, not months"
    },
    { 
      name: "CVS Digital", 
      description: "CVS's digital platform for pharmacies with inventory and prescription management tools.",
      price: 0,
      priceModel: "freemium",
      targetMarket: "SMB",
      weakness: "Limited features in free tier, vendor lock-in",
      yourAdvantage: "Full features from day one, no lock-in"
    },
    { 
      name: "Walgreens Connect", 
      description: "B2B platform for independent pharmacies to connect with Walgreens distribution network.",
      price: 49,
      priceModel: "tiered",
      targetMarket: "SMB",
      weakness: "Requires Walgreens partnership, limited autonomy",
      yourAdvantage: "Complete independence and flexibility"
    },
    { 
      name: "GoodRx Pro", 
      description: "Professional tools for pharmacies including pricing analytics and patient engagement features.",
      price: 27,
      priceModel: "tiered",
      targetMarket: "SMB",
      weakness: "Only pricing tools, no inventory or delivery",
      yourAdvantage: "Complete end-to-end solution"
    },
  ],
  
  competitiveAdvantages: [
    "Simple Database CRUD Operations",
    "Email Notifications & Alerts",
    "Payment Processing & Billing",
    "Basic Reporting & Analytics",
    "Advanced Analytics Dashboard",
    "Advanced Search & Filtering",
    "Inventory Management System",
    "Multi-location Support",
    "API Integrations",
    "Mobile-first Design"
  ],
  
  competitiveAdvantage: "The only platform that combines inventory management, local delivery, and health product compliance, focused on small businesses.",

  // Investment
  investment: {
    total: 60500,
    currency: "USD",
    breakdown: [
      { name: "Frontend Development", value: 19800, percentage: 33 },
      { name: "Backend & API", value: 16500, percentage: 27 },
      { name: "Integrations (Payment, Delivery)", value: 13200, percentage: 22 },
      { name: "Infrastructure (12 months)", value: 5500, percentage: 9 },
      { name: "Testing & QA", value: 5500, percentage: 9 },
    ],
    included: [
      "Complete MVP development",
      "12 months of hosting and infrastructure",
      "Payment and delivery integrations",
      "Responsive web app (mobile-first)",
      "Post-launch support (45-120 days)",
      "Complete technical documentation",
    ],
    notIncluded: [
      "Marketing and customer acquisition",
      "Native iOS/Android apps",
      "Additional custom integrations",
      "24/7 support after initial period",
    ],
    comparison: {
      traditional: 132000,
      savings: "54%",
      note: "Traditional agency would charge $132,000+ for the same scope"
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
  recommendedPlan: "growth" as const,
  timeline: [
    { 
      phase: 1,
      name: "Discovery", 
      duration: "2-3 weeks",
      description: "Research, planning and architecture",
      deliverables: ["Complete PRD", "Wireframes", "Architecture design", "Project timeline"],
      icon: "Search"
    },
    { 
      phase: 2,
      name: "MVP Build", 
      duration: "6-8 weeks",
      planDurations: {
        starter: "4-6 weeks",
        growth: "6-8 weeks",
        enterprise: "8-12 weeks"
      },
      description: "AI-accelerated development",
      deliverables: ["Authentication & users", "Core features", "Database & API", "Integrations", "Admin panel"],
      icon: "Code"
    },
    { 
      phase: 3,
      name: "Beta", 
      duration: "4-6 weeks",
      description: "Testing and iteration",
      deliverables: ["Beta users onboarding", "Feedback collection", "Bug fixes", "Performance optimization"],
      icon: "Users"
    },
    { 
      phase: 4,
      name: "Launch", 
      duration: "2 weeks",
      description: "Go-to-market execution",
      deliverables: ["Production deploy", "Marketing assets", "Support setup", "Monitoring & analytics"],
      icon: "Rocket"
    },
  ],
  
  techStack: [
    { category: "Frontend", items: ["React 18", "TypeScript", "TailwindCSS"] },
    { category: "Backend", items: ["Node.js", "PostgreSQL", "Supabase"] },
    { category: "Infra", items: ["Vercel", "AWS", "Docker"] },
    { category: "Integrations", items: ["Stripe", "Delivery API", "SendGrid"] },
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
        name: "Sarah Mitchell", 
        company: "Startup Innovate", 
        avatar: sarahJohnsonAvatar,
        quote: "Uaicode delivered our MVP in 12 weeks with quality that exceeded expectations. Highly recommend.",
        role: "CEO"
      },
      { 
        name: "Robert Taylor", 
        company: "TechFlow Solutions", 
        avatar: marcusAvatar,
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
        title: "Free Consultation", 
        description: "45min to align expectations and validate the scope",
        icon: "Calendar"
      },
      { 
        step: 2, 
        title: "Proposal & Sign Contract", 
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
  },

  // ==========================================
  // NEW SECTIONS - Decision Support Data
  // ==========================================

  // 1. Demand Validation - "The Demand"
  demandValidation: {
    searchVolume: 42000,
    trendsScore: 78,
    growthRate: "+23%",
    painPoints: [
      { pain: "Manual inventory tracking causes stockouts", intensity: 92, source: "Reddit/Forums" },
      { pain: "No integrated local delivery solution", intensity: 87, source: "Customer Reviews" },
      { pain: "Complex FDA/health compliance requirements", intensity: 75, source: "User Interviews" },
      { pain: "Disconnected systems waste time daily", intensity: 68, source: "Survey Data" }
    ],
    evidences: [
      { type: "Online Reviews", count: 2340, sentiment: "Negative", opportunity: "68% complain about fragmented tools" },
      { type: "Forum Discussions", count: 890, growth: "+45% YoY", opportunity: "Active community seeking solutions" },
      { type: "Social Mentions", count: 12000, sentiment: "Mixed", opportunity: "Growing awareness of the problem" },
      { type: "Job Postings", count: 456, growth: "+28% YoY", opportunity: "Companies hiring for manual tasks" }
    ],
    validationMethods: [
      { method: "Landing Page Test", cost: "$200-500", timeframe: "1-2 weeks", description: "Validate demand with a waitlist" },
      { method: "Customer Interviews", cost: "$0-200", timeframe: "2-3 weeks", description: "Deep dive with 10-15 prospects" },
      { method: "Prototype Demo", cost: "$500-1000", timeframe: "3-4 weeks", description: "Test with interactive mockup" },
      { method: "Paid Ad Test", cost: "$300-800", timeframe: "1 week", description: "Measure click-through rates" }
    ],
    conclusion: "Strong demand signals with 42K monthly searches and 23% growth. Pain points are validated across multiple sources."
  },

  // 2. Business Model - "The Model"
  businessModel: {
    primaryModel: "Subscription SaaS",
    modelType: "B2B2C Marketplace",
    revenueStreams: [
      { name: "Monthly Subscriptions", percentage: 70, mrr: 48594, type: "recurring", icon: "CreditCard" },
      { name: "Transaction Fees", percentage: 15, mrr: 10413, type: "transactional", icon: "Receipt" },
      { name: "Premium Add-ons", percentage: 10, mrr: 6942, type: "expansion", icon: "Sparkles" },
      { name: "Partner Commissions", percentage: 5, mrr: 3471, type: "partnership", icon: "Handshake" }
    ],
    pricingTiers: [
      { name: "Starter", price: 19, features: 5, targetCustomers: "Solo entrepreneurs", conversionRate: "25%" },
      { name: "Growth", price: 49, features: 12, targetCustomers: "Small teams (2-10)", conversionRate: "55%", recommended: true },
      { name: "Scale", price: 99, features: 25, targetCustomers: "Established businesses (10+)", conversionRate: "20%" }
    ],
    monetizationTimeline: [
      { month: 1, stream: "Subscriptions", status: "active", note: "Core revenue from day 1" },
      { month: 3, stream: "Premium Add-ons", status: "active", note: "Advanced features unlock" },
      { month: 6, stream: "Transaction Fees", status: "active", note: "Marketplace takes off" },
      { month: 9, stream: "Partner Commissions", status: "active", note: "Ecosystem partnerships" }
    ],
    conclusion: "Diversified revenue model with 70% recurring subscription revenue, reducing dependency on any single stream."
  },

  // 3. Go-to-Market Preview - "The Launch Strategy"
  goToMarketPreview: {
    primaryChannel: "Content Marketing + SEO",
    launchStrategy: "Product Hunt + Beta Community",
    channels: [
      { name: "SEO/Content", roi: 4.2, timeToResults: "3-6 months", priority: 1, effort: "High" },
      { name: "Paid Social", roi: 2.8, timeToResults: "1-2 months", priority: 2, effort: "Medium" },
      { name: "Partnerships", roi: 3.5, timeToResults: "2-4 months", priority: 3, effort: "Medium" },
      { name: "Email Marketing", roi: 4.0, timeToResults: "2-3 months", priority: 4, effort: "Low" }
    ],
    quickWins: [
      { action: "Launch on Product Hunt", impact: "High", effort: "Low", description: "Get initial traction and feedback" },
      { action: "5 LinkedIn posts about industry problems", impact: "Medium", effort: "Low", description: "Build thought leadership" },
      { action: "Reach out to 10 beta users personally", impact: "High", effort: "Medium", description: "Get first paying customers" }
    ],
    first90Days: [
      { day: 1, milestone: "Product Hunt launch", metric: "500+ upvotes" },
      { day: 14, milestone: "First 100 signups", metric: "10% conversion" },
      { day: 30, milestone: "First 10 paying customers", metric: "$490 MRR" },
      { day: 60, milestone: "50 paying customers", metric: "$2,450 MRR" },
      { day: 90, milestone: "First $5K MRR", metric: "100+ customers" }
    ],
    conclusion: "Content-led growth with a strong Product Hunt launch can generate 100+ customers in 90 days."
  },

  // 4. Quantified Differentiation
  quantifiedDifferentiation: {
    overallScore: 76,
    uniqueFeatures: [
      { feature: "FDA Compliance Automation", competitorsCoverage: "0/6", impact: "High", description: "No competitor offers this" },
      { feature: "SMB-focused Onboarding", competitorsCoverage: "1/6", impact: "High", description: "Setup in minutes vs months" },
      { feature: "Integrated Local Delivery", competitorsCoverage: "2/6", impact: "Medium", description: "End-to-end solution" },
      { feature: "Real-time Inventory Alerts", competitorsCoverage: "3/6", impact: "Medium", description: "Proactive vs reactive" }
    ],
    whyYouWin: [
      { reason: "Setup in minutes, not months", metric: "10x faster onboarding", vsCompetitor: "Amazon Pharmacy", icon: "Zap" },
      { reason: "SMB pricing from day 1", metric: "60% cheaper entry point", vsCompetitor: "CVS Digital", icon: "PiggyBank" },
      { reason: "Compliance built-in", metric: "Zero regulatory issues", vsCompetitor: "DoorDash Health", icon: "Shield" }
    ],
    competitorGaps: [
      { gap: "No SMB focus", affectedCompetitors: 4, opportunity: "Capture underserved market" },
      { gap: "Complex onboarding", affectedCompetitors: 5, opportunity: "Win on user experience" },
      { gap: "No compliance tools", affectedCompetitors: 6, opportunity: "Reduce customer risk" }
    ]
  },

  // 5. Timing Analysis - "The Timing"
  timingAnalysis: {
    timingScore: 85,
    verdict: "Excellent timing — market is growing but not saturated",
    macroTrends: [
      { trend: "Healthcare digitization post-COVID", impact: "+45% adoption", relevance: "High", icon: "TrendingUp" },
      { trend: "Local commerce revival", impact: "+28% demand", relevance: "High", icon: "Store" },
      { trend: "Regulatory modernization", impact: "Lower barriers", relevance: "Medium", icon: "FileCheck" },
      { trend: "AI automation wave", impact: "+35% efficiency gains", relevance: "High", icon: "Sparkles" }
    ],
    windowOfOpportunity: {
      opens: "Now",
      closes: "18-24 months",
      reason: "Major players will enter SMB segment within 2 years",
      urgency: "High"
    },
    firstMoverAdvantage: {
      score: 72,
      benefits: [
        "Brand recognition in niche before competition",
        "Customer lock-in through deep integrations",
        "Data moat for AI features and insights"
      ]
    },
    conclusion: "18-24 month window before major competition. Moving now captures first-mover advantage."
  },

  // 6. Pivot Scenarios - "Plan B & Beyond"
  pivotScenarios: {
    readinessScore: 78,
    scenarios: [
      { 
        name: "Vertical Pivot - Pet Health",
        viability: 82,
        effortToShift: "Low",
        marketSize: "$4.2B",
        trigger: "If B2B adoption < 50 users in 6 months",
        description: "Reuse 80% of platform for pet pharmacies"
      },
      { 
        name: "Feature Pivot - Delivery Only",
        viability: 71,
        effortToShift: "Medium",
        marketSize: "$8.1B",
        trigger: "If inventory features have low engagement",
        description: "Focus on last-mile delivery for health products"
      },
      { 
        name: "Market Pivot - LATAM Focus",
        viability: 68,
        effortToShift: "Medium",
        marketSize: "$1.8B",
        trigger: "If US acquisition costs > $200/customer",
        description: "Less competition, lower CAC in LATAM markets"
      }
    ],
    reusableAssets: [
      { asset: "Core Platform (~80% code)", reusabilityScore: 95 },
      { asset: "User Authentication System", reusabilityScore: 100 },
      { asset: "Payment Integration", reusabilityScore: 90 },
      { asset: "Delivery API Integration", reusabilityScore: 85 }
    ],
    decisionTriggers: [
      { metric: "User Acquisition", threshold: "< 50 users in 6 months", action: "Consider vertical pivot" },
      { metric: "Monthly Churn", threshold: "> 15%", action: "Feature reassessment needed" },
      { metric: "CAC", threshold: "> $300", action: "Consider market pivot" }
    ],
    conclusion: "Multiple viable pivot options with 78% asset reusability. Investment is protected."
  },

  // 7. Success Metrics - "Success Milestones"
  successMetrics: {
    northStar: {
      metric: "Monthly Active Stores",
      current: 0,
      month3Target: 50,
      month6Target: 200,
      month12Target: 1000,
      why: "Core indicator of platform value and revenue potential"
    },
    launchMilestones: [
      { month: 1, milestone: "First 10 paying customers", status: "critical", metric: "$490 MRR" },
      { month: 3, milestone: "$5K MRR", status: "important", metric: "~100 customers" },
      { month: 6, milestone: "Net Promoter Score > 40", status: "important", metric: "Customer love" },
      { month: 12, milestone: "$50K MRR", status: "ambitious", metric: "~1000 customers" }
    ],
    healthIndicators: [
      { kpi: "Weekly Active Users", healthy: "> 60%", warning: "40-60%", critical: "< 40%" },
      { kpi: "Feature Adoption", healthy: "> 3 features", warning: "2 features", critical: "< 2 features" },
      { kpi: "Support Tickets/User", healthy: "< 0.5", warning: "0.5-1.0", critical: "> 1.0" },
      { kpi: "Trial to Paid", healthy: "> 15%", warning: "8-15%", critical: "< 8%" }
    ],
    warningSigns: [
      { sign: "High trial abandonment", threshold: "> 70%", action: "Improve onboarding flow" },
      { sign: "Low feature adoption", threshold: "< 2 features used", action: "Simplify UX, add guides" },
      { sign: "Long sales cycle", threshold: "> 45 days", action: "Add self-serve options" }
    ],
    conclusion: "Clear milestones with North Star metric (Monthly Active Stores) guiding all decisions."
  },

  // 8. Resource Requirements - "Beyond the Money"
  resourceRequirements: {
    founderTime: {
      phase1: { name: "Discovery", hoursPerWeek: 10, focus: "Validation & customer feedback" },
      phase2: { name: "Build", hoursPerWeek: 15, focus: "Testing & design input" },
      phase3: { name: "Launch", hoursPerWeek: 25, focus: "Sales & marketing" },
      phase4: { name: "Scale", hoursPerWeek: 40, focus: "Full-time commitment required" }
    },
    teamTimeline: [
      { role: "Customer Success", when: "Month 4-6", cost: "$3-4K/mo", critical: true, reason: "Keep churn low" },
      { role: "Marketing Specialist", when: "Month 6-9", cost: "$4-5K/mo", critical: false, reason: "Scale acquisition" },
      { role: "Second Developer", when: "Month 9-12", cost: "$6-8K/mo", critical: true, reason: "Feature velocity" }
    ],
    criticalSkills: [
      { skill: "Product Decision Making", importance: "Critical", alternative: "Strategy consulting calls" },
      { skill: "Customer Communication", importance: "High", alternative: "Email templates provided" },
      { skill: "Basic Analytics", importance: "Medium", alternative: "Dashboard included in MVP" },
      { skill: "Sales Outreach", importance: "High", alternative: "Playbook provided" }
    ],
    externalSupport: [
      { type: "Legal (incorporation, terms)", cost: "$2-5K", timing: "One-time, Month 1" },
      { type: "Accounting/Bookkeeping", cost: "$200-400/mo", timing: "Ongoing from Month 3" },
      { type: "Domain & Compliance Advisor", cost: "$500-1K", timing: "One-time, Month 1-2" }
    ],
    conclusion: "Start part-time (10-15 hrs/week), scale to full-time by month 6. First hire at month 4-6."
  },

  // 9. Risk Quantification - Enhanced risks
  riskQuantification: {
    overallRiskScore: 42,
    riskLevel: "Moderate",
    categories: [
      { category: "Technical", score: 35, level: "Low", mainRisk: "Third-party API dependencies", icon: "Code" },
      { category: "Market", score: 45, level: "Moderate", mainRisk: "Major competitor entry", icon: "TrendingDown" },
      { category: "Execution", score: 40, level: "Moderate", mainRisk: "Timeline delays", icon: "Clock" },
      { category: "Financial", score: 50, level: "Moderate", mainRisk: "Longer payback period", icon: "DollarSign" }
    ],
    riskMatrix: [
      { risk: "Major competitor launches similar product", probability: "Medium", impact: "High", quadrant: "Monitor Closely" },
      { risk: "Technical debt slows feature development", probability: "Low", impact: "Medium", quadrant: "Accept" },
      { risk: "Slow initial customer adoption", probability: "Medium", impact: "Medium", quadrant: "Mitigate Actively" },
      { risk: "Regulatory changes in health sector", probability: "Low", impact: "High", quadrant: "Monitor" }
    ],
    mitigationCosts: {
      total: 8500,
      breakdown: [
        { item: "Multi-provider API fallbacks", cost: 3000, reducesRisk: "API dependencies", impact: "-15% technical risk" },
        { item: "Extended QA and testing", cost: 2500, reducesRisk: "Technical issues", impact: "-10% execution risk" },
        { item: "Market research refresh", cost: 1500, reducesRisk: "Market assumptions", impact: "-8% market risk" },
        { item: "Legal compliance review", cost: 1500, reducesRisk: "Regulatory issues", impact: "-5% overall risk" }
      ]
    },
    conclusion: "Overall moderate risk (42/100). $8,500 in mitigations can reduce risk score to ~30."
  },

  // 10. Market Benchmarks - "Industry Standards"
  marketBenchmarks: {
    industryComparison: [
      { metric: "Year 1 ARR", yourProjection: "$833K", industryAvg: "$450K", percentile: "Top 20%", status: "above" },
      { metric: "LTV/CAC Ratio", yourProjection: "5.3x", industryAvg: "3.0x", percentile: "Top 15%", status: "above" },
      { metric: "Monthly Churn", yourProjection: "5%", industryAvg: "7%", percentile: "Top 30%", status: "above" },
      { metric: "Payback Period", yourProjection: "4.5 mo", industryAvg: "12 mo", percentile: "Top 10%", status: "above" }
    ],
    successRates: {
      category: "Healthcare SaaS",
      survivalYear1: "78%",
      survivalYear3: "52%",
      reaching1MARR: "23%",
      yourEstimatedProbability: "68%",
      whyHigher: "Strong unit economics, focused niche, and validated demand signals"
    },
    fundingBenchmarks: {
      preSeed: { typical: "$100K-500K", requires: "MVP or strong founder-market fit" },
      seedRound: { typical: "$500K-2M", requires: "$10K MRR or strong traction proof" },
      seriesA: { typical: "$2-10M", requires: "$100K+ MRR, clear growth path" },
      yourReadiness: "Pre-seed/Bootstrap phase. Fundable after MVP with traction proof."
    },
    exitScenarios: [
      { type: "Acquisition by Private Equity", multipleRange: "3-5x ARR", timeframe: "Year 3-5", probability: "60%" },
      { type: "Strategic Acquisition", multipleRange: "5-8x ARR", timeframe: "Year 4-7", probability: "30%" },
      { type: "IPO (rare for this size)", multipleRange: "10x+ ARR", timeframe: "Year 7+", probability: "5%" }
    ],
    conclusion: "Projections are in Top 20% vs industry benchmarks. Strong fundamentals for future fundraising or exit."
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
