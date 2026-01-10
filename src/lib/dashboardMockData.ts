// Dashboard Mock Data - All data for the Planning My SaaS Dashboard

// Project Info Data - Dados do projeto vindos do wizard
export const projectInfoData = {
  // Dados básicos do projeto (viriam do wizard)
  projectName: "My Doctor Hub",
  description: "SaaS para venda de produtos alimentares e de saúde como suplementos e alimentos funcionais, com foco em gestão de estoque e delivery para pequenos negócios",
  
  // Tipo e indústria (mapeados das seleções do wizard)
  saasType: "E-commerce / Marketplace",
  industry: "Healthcare & Wellness",
  
  // Mercado alvo
  targetMarket: "Small Businesses",
  marketSize: "Local/Regional",
  
  // Metadados do relatório
  reportType: "AI-Generated Feasibility Report",
  successRate: 94, // % de projetos similares entregues com sucesso
  planType: "pro",
  generatedAt: new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
};

export const executiveSummaryData = {
  projectName: "SalesFlow AI",
  viabilityScore: 87,
  complexityScore: 65,
  
  // Storytelling fields
  verdictHeadline: "High viability, your idea has real traction potential — time to turn vision into product.",
  verdictSummary: "Your project shows strong market-product fit with favorable unit economics. The healthcare e-commerce space is growing rapidly, and your approach of connecting consumers with local suppliers fills a genuine market gap. Technical challenges are moderate and well within standard development scope.",
  recommendAction: "proceed" as const,
  benchmarkPercentile: 15,
  
  keyHighlights: [
    "High-growth market with 23% YoY expansion in health e-commerce",
    "Strong LTV/CAC ratio of 11.5x indicates excellent unit economics",
    "Low competition in SMB-focused AI sales tools niche",
    "Clear differentiation with AI-powered lead scoring",
    "First-mover advantage in conversational AI for sales",
  ],
  mainRisks: [
    {
      risk: "Dependency on third-party AI APIs (OpenAI, Anthropic) for core features",
      priority: "high" as const,
      mitigation: "We implement multi-provider fallbacks and intelligent caching",
    },
    {
      risk: "Longer sales cycle expected in enterprise segment (3-6 months)",
      priority: "medium" as const,
      mitigation: "PLG approach with freemium tier reduces friction",
    },
    {
      risk: "Potential regulatory changes in data privacy (GDPR, CCPA compliance)",
      priority: "medium" as const,
      mitigation: "Built-in compliance workflows and audit trails from day one",
    },
  ],
};

export const marketOpportunityData = {
  tam: "$12.4B",
  tamDescription: "Total Addressable Market - Global Sales Automation",
  sam: "$2.1B",
  samDescription: "Serviceable Addressable Market - SMB Segment Americas",
  som: "$85M",
  somDescription: "Serviceable Obtainable Market - First 3 Years Target",
  growthRate: "23%",
  growthPeriod: "CAGR 2024-2028",
  marketMaturity: "Growth Phase",
  opportunityScore: 92,
};

export const marketAnalysisData = {
  overview: {
    marketSize: "$4.2B",
    growthRate: "23% YoY",
    keyDrivers: [
      { driver: "AI Adoption", impact: "High", trend: "Accelerating" },
      { driver: "Remote Sales Teams", impact: "High", trend: "Stable" },
      { driver: "Cost Optimization Pressure", impact: "Medium", trend: "Growing" },
      { driver: "CRM Integration Demand", impact: "Medium", trend: "Growing" },
    ],
  },
  targetAudience: {
    primarySegment: "SMB SaaS Companies",
    companySize: "10-200 employees",
    annualRevenue: "$1M - $50M",
    decisionMakers: ["Founders/CEOs", "VP of Sales", "Sales Operations Managers", "Revenue Officers"],
    painPoints: [
      "Manual lead qualification wastes 40% of sales time",
      "Inconsistent follow-up leads to 30% lost opportunities",
      "No visibility into sales pipeline health",
      "Difficulty scaling sales operations",
    ],
    buyingTriggers: [
      "Hiring new sales reps",
      "Missing quarterly targets",
      "CRM migration",
      "Funding round",
    ],
  },
  competitiveLandscape: {
    marketLeaders: 3,
    directCompetitors: 12,
    indirectCompetitors: 25,
    marketConcentration: "Fragmented",
    entryBarriers: "Medium",
    substituteThreat: "Low",
  },
};

export const competitorsData = [
  {
    name: "Outreach.io",
    website: "https://outreach.io",
    priceRange: "$100 - $150/user/mo",
    positioning: "Enterprise Sales Engagement",
    marketShare: "18%",
    strengths: ["Strong brand", "Full feature set", "Enterprise integrations"],
    weaknesses: ["Complex setup", "Expensive for SMBs", "Steep learning curve"],
  },
  {
    name: "Salesloft",
    website: "https://salesloft.com",
    priceRange: "$75 - $125/user/mo",
    positioning: "Revenue Orchestration Platform",
    marketShare: "15%",
    strengths: ["Good UX", "Strong analytics", "Coaching features"],
    weaknesses: ["Limited AI capabilities", "No freemium", "US-centric"],
  },
  {
    name: "Apollo.io",
    website: "https://apollo.io",
    priceRange: "$39 - $79/user/mo",
    positioning: "All-in-one Sales Intelligence",
    marketShare: "12%",
    strengths: ["Affordable", "Large database", "Good prospecting"],
    weaknesses: ["Data accuracy issues", "Basic automation", "Limited support"],
  },
  {
    name: "Reply.io",
    website: "https://reply.io",
    priceRange: "$60 - $90/user/mo",
    positioning: "Sales Engagement Automation",
    marketShare: "8%",
    strengths: ["Easy to use", "Good email tools", "Affordable"],
    weaknesses: ["Limited integrations", "Basic reporting", "Smaller team"],
  },
  {
    name: "Instantly.ai",
    website: "https://instantly.ai",
    priceRange: "$30 - $77/mo",
    positioning: "Cold Email at Scale",
    marketShare: "5%",
    strengths: ["Very affordable", "Unlimited emails", "Simple"],
    weaknesses: ["Email only", "No phone/SMS", "Limited features"],
  },
];

export const yourAdvantages = [
  {
    advantage: "AI-Powered Lead Scoring",
    description: "Proprietary ML model that predicts conversion probability with 89% accuracy",
    competitorGap: "Most competitors use rule-based scoring",
  },
  {
    advantage: "30% Faster Time-to-Value",
    description: "Self-service onboarding with AI assistant reduces setup from 2 weeks to 3 days",
    competitorGap: "Competitors require professional services",
  },
  {
    advantage: "Transparent Pricing",
    description: "Flat-rate pricing without per-seat costs, includes all features",
    competitorGap: "Competitors charge per user with feature gates",
  },
  {
    advantage: "24/7 AI Support",
    description: "AI-powered support bot handles 80% of queries instantly",
    competitorGap: "Competitors offer limited support hours",
  },
];

export const pricingIntelligenceData = {
  marketAverage: "$127/mo",
  priceRange: { min: "$29", max: "$499", median: "$89" },
  pricingModels: [
    { model: "Per User/Seat", percentage: 45, trend: "Declining" },
    { model: "Tiered Plans", percentage: 35, trend: "Stable" },
    { model: "Usage-based", percentage: 15, trend: "Growing" },
    { model: "Flat Rate", percentage: 5, trend: "Growing" },
  ],
  recommendedPrice: "$89/mo",
  pricePositioning: "Value Leader",
  priceJustification: "15-30% below market average while offering superior AI features",
  freemiumStrategy: {
    recommended: true,
    freeLimit: "100 leads/month",
    conversionTarget: "12% to paid",
  },
};

export const investmentData = {
  monthlyMarketing: "$8,500",
  yearlyMarketing: "$102,000",
  cacEstimate: "$185",
  adsMonthlyBudget: "$4,500",
  infrastructureMonthly: "$450",
  infrastructureYearly: "$5,400",
  recommendedChannels: [
    { name: "Content Marketing & SEO", allocation: 30, budget: "$2,550/mo", priority: "High", expectedROI: "4.2x" },
    { name: "LinkedIn Ads", allocation: 25, budget: "$2,125/mo", priority: "High", expectedROI: "3.8x" },
    { name: "Google Ads (Search)", allocation: 20, budget: "$1,700/mo", priority: "Medium", expectedROI: "3.2x" },
    { name: "Partner/Affiliate Program", allocation: 15, budget: "$1,275/mo", priority: "Medium", expectedROI: "5.1x" },
    { name: "Webinars & Events", allocation: 10, budget: "$850/mo", priority: "Low", expectedROI: "2.8x" },
  ],
};

export const unitEconomicsData = {
  idealTicket: "$89/mo",
  yearlyValue: "$1,068/year",
  paybackPeriod: "4.2 months",
  averageLifetime: "24 months",
  ltv: "$2,136",
  cac: "$185",
  ltvCacRatio: 11.5,
  targetLtvCacRatio: ">3.0",
  monthlyChurn: "5%",
  annualChurn: "46%",
  grossMargin: "82%",
  howItWorks: "Based on $89/mo average ticket, 24-month customer lifetime, 5% monthly churn, and $185 customer acquisition cost. LTV/CAC ratio of 11.5x indicates highly profitable unit economics with room for increased marketing spend.",
};

export const marketTrends = [
  {
    trend: "AI-First Sales Tools",
    impact: "High",
    relevance: "Direct",
    timeframe: "Now - 2 years",
    description: "Products with native AI capabilities are capturing 3x market share vs traditional tools. Companies actively seeking AI solutions.",
    opportunity: "Position as AI-native from day one",
  },
  {
    trend: "Revenue Operations (RevOps)",
    impact: "High",
    relevance: "Direct",
    timeframe: "1 - 3 years",
    description: "Convergence of sales, marketing, and CS operations creating demand for unified platforms.",
    opportunity: "Build integrations and expand feature set",
  },
  {
    trend: "Conversational Selling",
    impact: "Medium",
    relevance: "Direct",
    timeframe: "Now - 2 years",
    description: "Shift from email-first to multi-channel engagement including chat, voice, and video.",
    opportunity: "Develop conversational AI features",
  },
  {
    trend: "Privacy-First Data",
    impact: "Medium",
    relevance: "Indirect",
    timeframe: "1 - 3 years",
    description: "Increasing regulations and buyer awareness around data privacy and consent.",
    opportunity: "Build privacy as a competitive advantage",
  },
  {
    trend: "PLG in B2B",
    impact: "Medium",
    relevance: "Direct",
    timeframe: "Now - 2 years",
    description: "Product-led growth becoming standard even in B2B sales tools.",
    opportunity: "Implement strong freemium and self-serve",
  },
];

export const technicalData = {
  description: "SalesFlow AI can be built using modern web technologies with a microservices architecture for scalability. The AI components require integration with LLM providers and custom ML models for lead scoring.",
  feasibilityScore: 78,
  complexityLevel: "Medium-High",
  estimatedDevTime: "4-6 months for MVP",
  recommendedStack: {
    frontend: [
      { tech: "React 18", reason: "Industry standard, large ecosystem" },
      { tech: "TypeScript", reason: "Type safety, better DX" },
      { tech: "TailwindCSS", reason: "Rapid UI development" },
      { tech: "Tanstack Query", reason: "Efficient data fetching" },
    ],
    backend: [
      { tech: "Node.js/Express", reason: "JavaScript ecosystem, fast development" },
      { tech: "PostgreSQL", reason: "Reliable, great for structured data" },
      { tech: "Redis", reason: "Caching, real-time features" },
      { tech: "Supabase", reason: "Auth, realtime, storage in one" },
    ],
    ai: [
      { tech: "OpenAI GPT-4", reason: "Best-in-class for NLP tasks" },
      { tech: "LangChain", reason: "AI orchestration framework" },
      { tech: "Pinecone", reason: "Vector database for embeddings" },
    ],
    infrastructure: [
      { tech: "Vercel", reason: "Easy deployment, edge functions" },
      { tech: "AWS", reason: "ML workloads, scalability" },
      { tech: "Docker", reason: "Consistent environments" },
    ],
    thirdParty: [
      { tech: "Stripe", reason: "Payments and subscriptions" },
      { tech: "SendGrid", reason: "Transactional emails" },
      { tech: "Twilio", reason: "SMS and voice features" },
      { tech: "Segment", reason: "Analytics and CDP" },
    ],
  },
};

export const developmentPhases = [
  {
    phase: 1,
    name: "Discovery & Planning",
    duration: "2-3 weeks",
    description: "Deep dive into requirements, user research, and technical architecture",
    deliverables: [
      "Product Requirements Document (PRD)",
      "User Stories & Acceptance Criteria",
      "Technical Architecture Document",
      "UI/UX Wireframes & User Flows",
      "Database Schema Design",
      "API Specification",
    ],
    milestones: ["Kickoff meeting", "Requirements sign-off", "Architecture review"],
  },
  {
    phase: 2,
    name: "MVP Development",
    duration: "10-14 weeks",
    description: "Core feature development with iterative sprints",
    deliverables: [
      "User Authentication & Authorization",
      "Lead Management Core",
      "AI Lead Scoring Engine",
      "Email Integration",
      "Basic Analytics Dashboard",
      "Stripe Integration",
    ],
    milestones: ["Alpha release", "Internal testing", "Beta release"],
  },
  {
    phase: 3,
    name: "Beta & Iteration",
    duration: "4-6 weeks",
    description: "User testing, feedback collection, and rapid iteration",
    deliverables: [
      "Beta User Onboarding",
      "Feedback Collection System",
      "Bug Fixes & Performance Optimization",
      "UX Improvements",
      "Documentation & Help Center",
    ],
    milestones: ["Beta launch", "100 beta users", "Feature freeze"],
  },
  {
    phase: 4,
    name: "Launch & Scale",
    duration: "Ongoing",
    description: "Public launch, marketing activation, and continuous improvement",
    deliverables: [
      "Public Launch",
      "Marketing Campaign Activation",
      "Customer Success Setup",
      "Analytics & Monitoring",
      "Feature Roadmap Execution",
    ],
    milestones: ["Public launch", "First 100 customers", "MRR targets"],
  },
];

export const technicalChallenges = [
  {
    challenge: "Real-time Lead Scoring at Scale",
    severity: "High",
    category: "Performance",
    description: "Processing thousands of leads in real-time with ML models while maintaining <200ms response times",
    solution: "Implement async scoring queue with Redis, use pre-computed embeddings, and batch processing for non-critical updates",
    estimatedEffort: "3-4 weeks",
  },
  {
    challenge: "AI API Costs & Rate Limits",
    severity: "High",
    category: "Cost",
    description: "OpenAI/Anthropic API costs can escalate quickly with heavy usage, plus rate limiting issues",
    solution: "Implement intelligent caching layer, request batching, fallback to smaller models, and usage-based pricing tiers",
    estimatedEffort: "2-3 weeks",
  },
  {
    challenge: "Email Deliverability",
    severity: "Medium",
    category: "Integration",
    description: "Ensuring high email deliverability rates while avoiding spam filters",
    solution: "Partner with established ESP (SendGrid/Mailgun), implement DKIM/SPF/DMARC, warm-up protocols, and sending limits",
    estimatedEffort: "2 weeks",
  },
  {
    challenge: "Multi-tenant Data Isolation",
    severity: "High",
    category: "Security",
    description: "Ensuring complete data isolation between customers in a SaaS environment",
    solution: "Row-level security in PostgreSQL, tenant context in all queries, audit logging, and penetration testing",
    estimatedEffort: "2-3 weeks",
  },
  {
    challenge: "CRM Integration Complexity",
    severity: "Medium",
    category: "Integration",
    description: "Each CRM (Salesforce, HubSpot, Pipedrive) has different APIs and data models",
    solution: "Build unified integration layer with adapters pattern, use native apps where possible, implement robust sync logic",
    estimatedEffort: "4-6 weeks",
  },
];

export const financialProjections = {
  totalFirstYearInvestment: "$162,400",
  breakdown: {
    developmentCost: "$55,000",
    marketingYear: "$102,000",
    infrastructureYear: "$5,400",
  },
  developmentBreakdown: [
    { name: "Frontend Development", value: 18000, percentage: 33 },
    { name: "Backend & API", value: 15000, percentage: 27 },
    { name: "AI/ML Features", value: 12000, percentage: 22 },
    { name: "Infrastructure & DevOps", value: 5000, percentage: 9 },
    { name: "Testing & QA", value: 5000, percentage: 9 },
  ],
  marketingBreakdown: [
    { name: "Content & SEO", value: 30600, percentage: 30 },
    { name: "LinkedIn Ads", value: 25500, percentage: 25 },
    { name: "Google Ads", value: 20400, percentage: 20 },
    { name: "Partnerships", value: 15300, percentage: 15 },
    { name: "Events", value: 10200, percentage: 10 },
  ],
  pricingStrategy: {
    idealTicket: "$89",
    marketAverage: "$127",
    positioning: "Value Leader",
    breakEvenMonths: 8.5,
    breakEvenCustomers: 152,
  },
};

export const roiData = [
  { month: "M1", revenue: 890, costs: 18500, roi: -95, cumulative: -17610 },
  { month: "M2", revenue: 2670, costs: 12500, roi: -79, cumulative: -27440 },
  { month: "M3", revenue: 5340, costs: 12500, roi: -57, cumulative: -34600 },
  { month: "M4", revenue: 8900, costs: 12500, roi: -29, cumulative: -38200 },
  { month: "M5", revenue: 13350, costs: 12500, roi: 7, cumulative: -37350 },
  { month: "M6", revenue: 18690, costs: 13000, roi: 44, cumulative: -31660 },
  { month: "M7", revenue: 24920, costs: 13000, roi: 92, cumulative: -19740 },
  { month: "M8", revenue: 32040, costs: 13500, roi: 137, cumulative: -1200 },
  { month: "M9", revenue: 40050, costs: 14000, roi: 186, cumulative: 24850 },
  { month: "M10", revenue: 48950, costs: 14000, roi: 250, cumulative: 59800 },
  { month: "M11", revenue: 58740, costs: 14500, roi: 305, cumulative: 104040 },
  { month: "M12", revenue: 69420, costs: 15000, roi: 363, cumulative: 158460 },
];

export const breakEvenData = [
  { month: 1, revenue: 890, costs: 18500, customers: 10, breakEvenLine: 19067 },
  { month: 2, revenue: 2670, costs: 31000, customers: 30, breakEvenLine: 38133 },
  { month: 3, revenue: 5340, costs: 43500, customers: 60, breakEvenLine: 57200 },
  { month: 4, revenue: 8900, costs: 56000, customers: 100, breakEvenLine: 76267 },
  { month: 5, revenue: 13350, costs: 68500, customers: 150, breakEvenLine: 95333 },
  { month: 6, revenue: 18690, costs: 81500, customers: 210, breakEvenLine: 114400 },
  { month: 7, revenue: 24920, costs: 94500, customers: 280, breakEvenLine: 133467 },
  { month: 8, revenue: 32040, costs: 108000, customers: 360, breakEvenLine: 152533 },
  { month: 9, revenue: 40050, costs: 122000, customers: 450, breakEvenLine: 171600 },
  { month: 10, revenue: 48950, costs: 136000, customers: 550, breakEvenLine: 190667 },
  { month: 11, revenue: 58740, costs: 150500, customers: 660, breakEvenLine: 209733 },
  { month: 12, revenue: 69420, costs: 165500, customers: 780, breakEvenLine: 228800 },
];

export const mrrEvolutionData = [
  { month: "Jan Y1", mrr: 890, arr: 10680, customers: 10 },
  { month: "Mar Y1", mrr: 5340, arr: 64080, customers: 60 },
  { month: "Jun Y1", mrr: 18690, arr: 224280, customers: 210 },
  { month: "Sep Y1", mrr: 40050, arr: 480600, customers: 450 },
  { month: "Dec Y1", mrr: 69420, arr: 833040, customers: 780 },
  { month: "Mar Y2", mrr: 98000, arr: 1176000, customers: 1100 },
  { month: "Jun Y2", mrr: 142000, arr: 1704000, customers: 1600 },
  { month: "Sep Y2", mrr: 195000, arr: 2340000, customers: 2200 },
  { month: "Dec Y2", mrr: 267000, arr: 3204000, customers: 3000 },
  { month: "Jun Y3", mrr: 445000, arr: 5340000, customers: 5000 },
  { month: "Dec Y3", mrr: 712000, arr: 8544000, customers: 8000 },
];

export const userJourneyData = {
  businessType: "B2B Sales Automation SaaS",
  stages: [
    {
      stage: "Discovery",
      percentage: 100,
      users: 10000,
      color: "#FFD700",
      actions: ["Sees LinkedIn/Google ad", "Reads blog post", "Visits landing page", "Watches demo video"],
      metrics: { timeSpent: "3-5 min", bounceRate: "45%" },
    },
    {
      stage: "Trial/Demo",
      percentage: 15,
      users: 1500,
      color: "#FFA500",
      actions: ["Signs up for free trial", "Connects email account", "Explores dashboard", "Imports sample leads"],
      metrics: { timeSpent: "20-30 min", activation: "68%" },
    },
    {
      stage: "Onboarding",
      percentage: 10,
      users: 1000,
      color: "#4CAF50",
      actions: ["Completes setup wizard", "Connects CRM", "Creates first campaign", "Sends first outreach"],
      metrics: { timeSpent: "45-60 min", completion: "72%" },
    },
    {
      stage: "Active Usage",
      percentage: 7,
      users: 700,
      color: "#2196F3",
      actions: ["Uses AI scoring daily", "Manages pipeline", "Reviews analytics", "Invites team members"],
      metrics: { timeSpent: "2-3 hrs/week", retention: "85%" },
    },
    {
      stage: "Growth",
      percentage: 4,
      users: 400,
      color: "#9C27B0",
      actions: ["Upgrades to paid plan", "Adds more seats", "Enables integrations", "Refers colleagues"],
      metrics: { timeSpent: "5+ hrs/week", nps: "72" },
    },
  ],
};

export const engagementLoops = [
  {
    name: "Daily Score Check",
    type: "Habit Loop",
    trigger: "Morning notification with new lead scores",
    action: "Review AI-scored leads and prioritize outreach",
    reward: "High-value leads identified, time saved",
    variableReward: "Surprise hot leads with buying signals",
    frequency: "Daily",
    retentionImpact: "High",
  },
  {
    name: "Weekly Pipeline Review",
    type: "Scheduled Loop",
    trigger: "Monday email with weekly pipeline summary",
    action: "Analyze win/loss, adjust strategies",
    reward: "Performance insights, achievement badges",
    variableReward: "Personalized AI recommendations",
    frequency: "Weekly",
    retentionImpact: "High",
  },
  {
    name: "Campaign Performance",
    type: "Feedback Loop",
    trigger: "Campaign metrics update notification",
    action: "Check open rates, reply rates, conversions",
    reward: "Optimization opportunities revealed",
    variableReward: "A/B test winners announced",
    frequency: "Real-time",
    retentionImpact: "Medium",
  },
  {
    name: "Team Leaderboard",
    type: "Social Loop",
    trigger: "Weekly leaderboard update",
    action: "Compare performance with teammates",
    reward: "Recognition, gamification badges",
    variableReward: "Monthly prizes for top performers",
    frequency: "Weekly",
    retentionImpact: "Medium",
  },
  {
    name: "AI Learning Updates",
    type: "Progress Loop",
    trigger: "AI model improvement notification",
    action: "Review how AI learned from your feedback",
    reward: "Better predictions, personalized experience",
    variableReward: "Unlock new AI features",
    frequency: "Bi-weekly",
    retentionImpact: "Medium",
  },
];

export const screenMockups = [
  {
    name: "Main Dashboard",
    description: "Overview with key metrics, lead scores, and activity feed",
    category: "Core",
    features: ["AI Score Cards", "Pipeline Overview", "Activity Timeline", "Quick Actions"],
  },
  {
    name: "Lead Management",
    description: "List and detail view of all leads with AI scoring",
    category: "Core",
    features: ["Smart Filters", "Bulk Actions", "AI Insights", "Contact Timeline"],
  },
  {
    name: "Campaign Builder",
    description: "Multi-channel campaign creation with AI assistance",
    category: "Core",
    features: ["Drag & Drop", "AI Copywriting", "A/B Testing", "Scheduling"],
  },
  {
    name: "Analytics Hub",
    description: "Comprehensive reporting and performance analytics",
    category: "Analytics",
    features: ["Custom Dashboards", "Export Reports", "Team Metrics", "Trend Analysis"],
  },
  {
    name: "Settings & Integrations",
    description: "Account settings, team management, and integrations",
    category: "Settings",
    features: ["User Management", "API Keys", "CRM Connections", "Billing"],
  },
  {
    name: "Mobile App",
    description: "On-the-go access to leads and notifications",
    category: "Mobile",
    features: ["Push Notifications", "Quick Log", "Voice Notes", "Offline Mode"],
  },
];

export const brandCopyManual = {
  brandName: "SalesFlow AI",
  voiceTone: {
    primary: "Professional yet approachable",
    characteristics: [
      { trait: "Confident", description: "We know our product delivers results" },
      { trait: "Clear", description: "No jargon, just value" },
      { trait: "Helpful", description: "Always focused on user success" },
      { trait: "Innovative", description: "Leading with AI, not following" },
    ],
    doList: [
      "Use active voice",
      "Be specific with numbers and results",
      "Address pain points directly",
      "Make it conversational",
    ],
    dontList: [
      "Use corporate buzzwords",
      "Make empty promises",
      "Be condescending",
      "Overcomplicate explanations",
    ],
  },
  taglines: [
    { tagline: "Sell Smarter. Close Faster.", usage: "Primary" },
    { tagline: "AI That Actually Sells", usage: "Campaign" },
    { tagline: "Your Sales Team's Secret Weapon", usage: "Social" },
  ],
  valueProposition: "SalesFlow AI transforms your sales process with intelligent lead scoring and automated outreach, helping you close 40% more deals in half the time.",
  elevatorPitch: "SalesFlow AI is the sales automation platform that uses artificial intelligence to score leads, automate personalized outreach, and give your team superpowers. Unlike traditional tools that just send emails, we predict which leads will buy and tell you exactly what to say.",
  keyMessages: [
    {
      message: "AI-powered lead scoring saves you 10+ hours per week",
      audience: "Sales Reps",
      proof: "89% prediction accuracy",
    },
    {
      message: "Close 40% more deals with intelligent prioritization",
      audience: "Sales Managers",
      proof: "Based on customer data",
    },
    {
      message: "Get started in 3 days, not 3 months",
      audience: "Decision Makers",
      proof: "Self-serve onboarding",
    },
  ],
  ctaExamples: [
    { cta: "Start Your Free Trial", context: "Landing page hero" },
    { cta: "See AI in Action", context: "Demo request" },
    { cta: "Get Your Sales Score", context: "Lead magnet" },
    { cta: "Book a Demo", context: "Enterprise" },
  ],
  emailSubjectLines: [
    "Your leads are waiting (and scored)",
    "40% more deals. Same team.",
    "The AI your sales team needs",
  ],
};

export const brandIdentityManual = {
  colorPalette: {
    primary: { hex: "#FFD700", hsl: "51, 100%, 50%", name: "Golden Yellow", usage: "CTAs, highlights, accent" },
    secondary: { hex: "#1A1A2E", hsl: "240, 27%, 14%", name: "Deep Navy", usage: "Backgrounds, text" },
    accent: { hex: "#3B82F6", hsl: "217, 91%, 60%", name: "Electric Blue", usage: "Links, interactive elements" },
    success: { hex: "#10B981", hsl: "160, 84%, 39%", name: "Emerald", usage: "Success states, positive metrics" },
    warning: { hex: "#F59E0B", hsl: "38, 92%, 50%", name: "Amber", usage: "Warnings, attention" },
    error: { hex: "#EF4444", hsl: "0, 84%, 60%", name: "Red", usage: "Errors, negative states" },
    neutral: [
      { hex: "#F8FAFC", name: "Slate 50", usage: "Light backgrounds" },
      { hex: "#94A3B8", name: "Slate 400", usage: "Muted text" },
      { hex: "#334155", name: "Slate 700", usage: "Body text" },
      { hex: "#0F172A", name: "Slate 900", usage: "Headings" },
    ],
  },
  typography: {
    headings: { font: "Inter", weight: "700", fallback: "system-ui, sans-serif" },
    subheadings: { font: "Inter", weight: "600", fallback: "system-ui, sans-serif" },
    body: { font: "Inter", weight: "400", fallback: "system-ui, sans-serif" },
    mono: { font: "JetBrains Mono", weight: "400", fallback: "monospace" },
    scale: [
      { name: "Display", size: "4rem", lineHeight: "1.1" },
      { name: "H1", size: "2.5rem", lineHeight: "1.2" },
      { name: "H2", size: "2rem", lineHeight: "1.25" },
      { name: "H3", size: "1.5rem", lineHeight: "1.3" },
      { name: "Body", size: "1rem", lineHeight: "1.5" },
      { name: "Small", size: "0.875rem", lineHeight: "1.5" },
    ],
  },
  logoUsage: {
    minSize: "32px height",
    clearSpace: "Equal to the height of the 'S' in SalesFlow",
    backgrounds: ["Works on dark backgrounds (preferred)", "Light version for white backgrounds"],
    donts: ["Don't stretch or distort", "Don't change colors", "Don't add effects", "Don't rotate"],
  },
  iconography: {
    style: "Lucide Icons",
    strokeWidth: "2px",
    corners: "Rounded",
    usage: "Consistent across all UI elements",
  },
  spacing: {
    base: "4px",
    scale: ["4px", "8px", "12px", "16px", "24px", "32px", "48px", "64px"],
    containerMax: "1280px",
    sectionPadding: "80px vertical",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    full: "9999px",
  },
};

export const logoSuggestions = [
  {
    variant: "Primary",
    description: "Full logo with wordmark on dark background",
    usage: "Website header, marketing materials",
    colors: { icon: "#FFD700", text: "#FFFFFF" },
  },
  {
    variant: "Light Mode",
    description: "Inverted colors for light backgrounds",
    usage: "Light theme, print materials",
    colors: { icon: "#FFD700", text: "#1A1A2E" },
  },
  {
    variant: "Icon Only",
    description: "Symbol mark without text",
    usage: "Favicon, app icon, small spaces",
    colors: { icon: "#FFD700" },
  },
  {
    variant: "Monochrome",
    description: "Single color version",
    usage: "Watermarks, embossing, limited color contexts",
    colors: { all: "#FFFFFF" },
  },
];

export const mockupPreviews = [
  {
    type: "Business Cards",
    description: "Professional double-sided cards with logo and contact info",
    specs: "3.5\" x 2\", 350gsm matte finish",
  },
  {
    type: "Social Media Kit",
    description: "Profile pictures, cover images, and post templates",
    specs: "LinkedIn, Twitter, Facebook, Instagram formats",
  },
  {
    type: "App Icon",
    description: "iOS and Android app icons with proper guidelines",
    specs: "1024x1024 master, all required sizes",
  },
  {
    type: "Email Signature",
    description: "HTML email signature with logo and social links",
    specs: "600px max width, dark and light versions",
  },
  {
    type: "Presentation Template",
    description: "Slide deck template with brand guidelines",
    specs: "16:9, Google Slides and PowerPoint",
  },
  {
    type: "Letterhead",
    description: "Official document header and footer",
    specs: "A4 and US Letter formats",
  },
];

export const landingPageData = {
  sections: [
    {
      name: "Hero Section",
      description: "Headline, subheadline, CTA, and hero image/video",
      keyElements: ["Compelling headline", "Value prop", "Primary CTA", "Social proof"],
    },
    {
      name: "Pain Points",
      description: "3 key problems your product solves",
      keyElements: ["Problem statements", "Empathy-driven copy", "Visual icons"],
    },
    {
      name: "Solution Overview",
      description: "How your product solves the problems",
      keyElements: ["Feature highlights", "Product screenshots", "Benefit-focused copy"],
    },
    {
      name: "Features Grid",
      description: "Detailed feature breakdown with visuals",
      keyElements: ["Feature cards", "Icons", "Short descriptions"],
    },
    {
      name: "Social Proof",
      description: "Testimonials and customer logos",
      keyElements: ["Customer quotes", "Star ratings", "Company logos"],
    },
    {
      name: "Pricing",
      description: "Clear pricing tiers with feature comparison",
      keyElements: ["Price cards", "Feature lists", "CTA buttons"],
    },
    {
      name: "FAQ",
      description: "Common questions answered",
      keyElements: ["Accordion format", "Clear answers", "Contact option"],
    },
    {
      name: "Final CTA",
      description: "Strong closing section with call to action",
      keyElements: ["Urgency element", "Primary CTA", "Secondary option"],
    },
  ],
  conversionElements: [
    "Above-fold CTA visible without scrolling",
    "Trust badges near CTAs",
    "Mobile-optimized design",
    "Fast loading (<3s)",
    "Exit-intent popup",
    "Chat widget for questions",
  ],
  previewNote: "A fully functional landing page template is included in your download package. You can customize it with your brand colors, copy, and images.",
};
