import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNewsletterPosts } from "@/hooks/useNewsletterPosts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, ArrowUpNarrowWide, ArrowDownNarrowWide, Youtube, Radio, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import NewsletterSuccessDialog from "@/components/newsletter/NewsletterSuccessDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import heroImage from "@/assets/newsletter-hero.webp";
import insightAiPoweredMvp from "@/assets/insight-ai-powered-mvp.webp";
import insightMicroSaasAdvantage from "@/assets/insight-microsaas-advantage.webp";
import insightGrowthRoadmap from "@/assets/insight-growth-roadmap.webp";
import insightAiAutomationGuide from "@/assets/insight-ai-automation-guide.webp";
import insightTechStackMvp from "@/assets/insight-tech-stack-mvp.webp";
import insightMarketValidation from "@/assets/insight-market-validation.webp";
import founderRafaelLuz from "@/assets/founder-rafael-luz.webp";
import authorMarcusSterling from "@/assets/author-marcus-sterling.webp";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  youtubeVideoId?: string;
  highlights?: string[];
  subtitles?: string[];
}

const newsletterSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .refine(
      (email) => !email.includes('+'),
      "Please use a standard email address without '+' symbols"
    ),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Why an AI-Powered MVP is Your Next Big Move",
    slug: "ai-powered-mvp-next-big-move",
    excerpt: "Discover why integrating AI from day one gives your MVP a competitive edge that traditional development can't match. Learn how AI-powered features can reduce development time by 60% while delivering smarter products.",
    content: `The traditional MVP approach is being disrupted. Building an AI-powered MVP isn't just a trend—it's becoming the new standard for startups that want to compete in 2025 and beyond.

## The New MVP Paradigm

Gone are the days when a basic CRUD application could wow investors and early adopters. Today's users expect intelligent, personalized experiences from day one. They want products that learn from their behavior, anticipate their needs, and deliver value automatically. This is where AI-powered MVPs shine.

Traditional MVPs force you to choose between features and speed. You either launch quickly with basic functionality or spend months building sophisticated features. AI changes this equation entirely. With modern AI tools and APIs, you can build intelligent features in days, not months.

## Speed Meets Intelligence

The data is compelling: AI-powered MVPs reduce development time by 60% compared to traditional approaches. How? By leveraging pre-trained models, no-code AI platforms, and intelligent automation that would take months to build from scratch.

Consider a typical SaaS MVP. Traditional development might require separate teams for backend logic, data processing, user management, and analytics. With AI, many of these components come ready-made. Natural language processing for search? There's an API for that. Predictive analytics? Pre-built models have you covered. Customer support? AI agents handle it automatically.

## The Competitive Advantage

Here's the reality: your competitors are already exploring AI. The question isn't whether to integrate AI into your MVP—it's how quickly you can do it. Companies that launch AI-powered MVPs achieve several key advantages:

**Faster Time-to-Market**: Launch in weeks instead of months by leveraging existing AI capabilities rather than building everything from scratch. This speed advantage means you validate your market faster and iterate based on real feedback sooner.

**Smarter Products from Day One**: Users don't see a "beta" product—they see intelligent features that compete with established players. Your MVP can offer personalization, predictive features, and automated workflows that would normally require years of development.

**Lower Development Costs**: AI tools and APIs dramatically reduce the engineering resources needed. A small team can build what previously required a large development organization. This means your runway extends further and your path to profitability shortens.

**Built-In Scaling**: AI-powered features scale automatically. Whether you have 10 users or 10,000, your AI systems handle the load without requiring proportional increases in human resources or infrastructure.

## Real-World Impact

Look at successful recent launches. The fastest-growing startups aren't the ones with the most engineers—they're the ones leveraging AI most effectively. A small team can now build what previously required dozens of developers. They launch faster, learn faster, and scale faster.

One founder recently launched a customer support SaaS in just three weeks by combining AI chat capabilities with smart workflow automation. What would have taken six months and significant capital investment now took less than a month with a team of three. They achieved profitability in month four.

## The Implementation Strategy

Starting with an AI-powered MVP doesn't mean rebuilding everything with custom AI models. The smartest approach leverages existing AI services and platforms:

**Identify High-Impact Features**: Where can AI deliver immediate value? Customer support? Content generation? Data analysis? Personalization? Start with features that directly impact your key metrics.

**Use AI-as-a-Service**: Don't build what you can buy. Modern AI platforms offer sophisticated capabilities through simple APIs. This approach reduces risk, accelerates development, and allows you to focus on your unique value proposition.

**Design for Learning**: Your AI systems should improve over time. Build feedback loops that capture user behavior, preferences, and outcomes. This data becomes your competitive moat as your AI gets smarter while competitors are still manually coding features.

**Plan for Humans + AI**: The best products combine AI automation with human oversight. Design your MVP so AI handles routine tasks while humans focus on high-value interactions. This hybrid approach delivers superior results at lower cost.

## Making the Decision

The case for AI-powered MVPs is clear: faster development, lower costs, smarter features, and better competitive positioning. The technology is mature, accessible, and proven. The question is no longer "should we use AI?" but "how quickly can we integrate it?"

Your next MVP isn't just an app—it's an intelligent platform that learns, adapts, and scales. That's not the future. That's the expectation today. Companies that understand this launch faster, learn faster, and win bigger.

The traditional MVP is dead. The AI-powered MVP is here. Which one are you building?`,
    imageUrl: insightAiPoweredMvp,
    author: {
      name: "Marcus Sterling - The Editor",
      avatar: authorMarcusSterling
    },
    category: "AI & Innovation",
    publishedAt: "2025-11-12",
    readTime: "8 min read",
    highlights: [
      "AI-powered MVPs reduce development time by 60%",
      "Launch in weeks instead of months",
      "Lower costs with AI-as-a-Service approach"
    ],
    subtitles: [
      "The New MVP Paradigm",
      "Speed Meets Intelligence",
      "The Competitive Advantage",
      "Real-World Impact",
      "The Implementation Strategy",
      "Making the Decision"
    ]
  },
  {
    id: "2",
    title: "Launch Fast, Succeed Faster: The MicroSaaS Advantage",
    slug: "microsaas-launch-fast-succeed-faster",
    excerpt: "MicroSaaS products are capturing niche markets with minimal investment and maximum impact. Explore the lean approach that's helping entrepreneurs build profitable businesses in weeks, not years.",
    content: `The SaaS landscape is changing. While everyone chases the next unicorn, smart entrepreneurs are building profitable MicroSaaS businesses that generate significant revenue with minimal overhead.

## What is MicroSaaS?

MicroSaaS represents a fundamental shift in how we think about software businesses. Instead of trying to be everything to everyone, MicroSaaS products solve specific problems for well-defined audiences. They're lean, focused, and designed for profitability from day one—not growth at all costs.

Think of traditional SaaS as building a department store. MicroSaaS is more like opening a specialized boutique. You serve fewer customers, but you serve them exceptionally well. And you can do it with a team of one or two people instead of dozens.

## The Economics Make Sense

Traditional SaaS requires massive upfront investment. You need to build comprehensive features, hire large teams, and burn cash for years before reaching profitability. The average SaaS company takes 3-5 years to become profitable, if they survive that long.

MicroSaaS flips this model. Many MicroSaaS founders reach profitability within their first year—often within months. How? By keeping operations lean, focusing on high-margin customers, and building only what's needed to solve a specific problem.

Consider the numbers: A traditional SaaS might need $2 million in funding and a team of 20+ to launch. A MicroSaaS can launch with less than $10,000 and a solo founder or small team. The traditional SaaS targets 10,000+ customers to be viable. The MicroSaaS might only need 100-500 customers paying $50-200/month to generate a comfortable income.

## Finding Your Niche

The key to MicroSaaS success is niche selection. You're looking for problems that are:

**Specific Enough**: Your solution sol't serve everyone—it serves a particular audience with a particular need. This specificity is your strength, not your weakness.

**Painful Enough**: The problem must be significant enough that people will pay to solve it. Minor inconveniences don't build businesses. Real pain points do.

**Underserved Enough**: Big SaaS companies can't or won't serve every niche. They focus on large markets. This leaves countless valuable niches underserved—perfect for MicroSaaS.

**Accessible Enough**: You need to be able to reach your target customers without massive marketing budgets. The best MicroSaaS niches have existing communities, forums, or channels where you can connect directly with prospects.

## The Launch Strategy

MicroSaaS succeeds by moving fast and staying lean:

**Week 1-2: Validate**: Before writing code, validate demand. Post in relevant communities. Run targeted ads. Create a landing page. The goal is to get 20-50 people to express genuine interest (ideally with money).

**Week 3-6: Build MVP**: Build the minimum feature set that solves the core problem. Not the perfect product—the working product. Modern tools let you build sophisticated MVPs in weeks, not months.

**Week 7-8: Launch**: Launch to your validation audience first. These early customers become your partners in refining the product. Their feedback shapes your roadmap.

**Month 3+: Optimize & Scale**: Once product-market fit is proven, gradually add features and acquire more customers. But never lose the lean mindset that got you here.

## Real Success Stories

The MicroSaaS landscape is filled with inspiring stories:

One founder built a specialized analytics tool for Shopify stores. He launched in three weeks, acquired his first paying customer in week four, and reached $5,000 MRR within six months. Two years later, he's at $40,000 MRR with just himself and a part-time contractor.

Another entrepreneur created a workflow automation tool for a specific industry. She identified the niche through her previous job, validated it by pre-selling to five customers, and built the MVP in four weeks. She reached profitability in month two and now runs a thriving business that requires about 20 hours of work per week.

## Why MicroSaaS Works Now

Several factors make this the golden age for MicroSaaS:

**Modern Tools**: No-code and low-code platforms let you build sophisticated products without large development teams. AI tools accelerate development even further.

**Distribution Channels**: You can reach niche audiences directly through communities, content marketing, and targeted advertising. You don't need massive marketing budgets—just clear messaging and the right channels.

**Payment Infrastructure**: Stripe, Paddle, and similar platforms make it trivial to accept payments globally. You can launch with enterprise-grade payment processing from day one.

**Cloud Infrastructure**: AWS, Vercel, and similar services provide enterprise capabilities at startup prices. You pay for what you use and scale automatically.

## The Path Forward

MicroSaaS isn't about building small products—it's about building focused products that deliver outsized value to specific audiences. It's about profitability over growth. Sustainability over fundraising. Freedom over exits.

The best part? You can start today. Pick a niche you understand, identify a painful problem, validate demand, and build. In six months, you could be running a profitable software business. No venture capital needed. No massive team required. Just focus, execution, and commitment to solving real problems for real people.

The MicroSaaS advantage isn't just about launching fast—it's about building sustainable, profitable businesses that align with how you want to live and work. That's the real revolution.`,
    imageUrl: insightMicroSaasAdvantage,
    author: {
      name: "Marcus Sterling - The Editor",
      avatar: authorMarcusSterling
    },
    category: "Business Strategy",
    publishedAt: "2025-10-10",
    readTime: "7 min read",
    highlights: [
      "Reach profitability within months, not years",
      "Launch with less than $10,000 investment",
      "Only need 100-500 customers to be viable"
    ],
    subtitles: [
      "What is MicroSaaS?",
      "The Economics Make Sense",
      "Finding Your Niche",
      "The Launch Strategy",
      "Real Success Stories",
      "Why MicroSaaS Works Now",
      "The Path Forward"
    ]
  },
  {
    id: "3",
    title: "From MVP to Market Leader: A Growth Roadmap",
    slug: "mvp-to-market-leader-growth-roadmap",
    excerpt: "Transform your validated MVP into an industry leader with this proven growth roadmap. Learn the critical milestones, metrics, and strategies that separate market leaders from the rest.",
    content: `You've launched your MVP. You've validated product-market fit. Now comes the hardest part: transforming that validated concept into a market-leading business. This roadmap shows you how.

## Stage 1: Validation to Scale (Months 1-6)

The transition from MVP to scalable product is critical. Many companies fail here because they try to scale before truly achieving product-market fit. Here's how to know you're ready:

**Strong Unit Economics**: Your customer acquisition cost (CAC) is predictable and significantly lower than lifetime value (LTV). Aim for an LTV:CAC ratio of at least 3:1 before scaling aggressively.

**Retention Signals**: Customers aren't just using your product—they're sticking around. Aim for 90%+ monthly retention for B2B or 40%+ for consumer products before scaling.

**Organic Growth**: You're seeing word-of-mouth growth and inbound interest without paid acquisition. This signals genuine product-market fit.

**Repeatable Sales Process**: You've identified and documented a sales process that works consistently. You know which channels work, what messaging resonates, and how long the sales cycle takes.

During this stage, focus on three key activities:

**Product Refinement**: Use feedback from your early adopters to eliminate friction and add high-impact features. Don't add everything users request—focus on features that improve your core value proposition.

**Process Documentation**: Document everything. Your sales process. Your onboarding flow. Your customer success playbook. This documentation becomes the foundation for scaling.

**Metric Establishment**: Define and track your north star metric—the single number that best represents the value you deliver. Also track key operational metrics: activation rate, feature adoption, time-to-value, and expansion revenue.

## Stage 2: Building Your Growth Engine (Months 7-18)

With validation confirmed and processes documented, it's time to build systematic growth:

**Channel Expansion**: You've identified your best channel (content, paid ads, partnerships, etc.). Now systematically test and optimize additional channels. Don't abandon your best channel—double down on it while carefully testing others.

**Team Building**: Your first key hires matter immensely. Hire for roles that directly impact your constraints. If customer success is your bottleneck, hire there first. If sales velocity is limiting growth, hire a senior sales rep or sales leader.

**Systems and Automation**: Manual processes that worked for 10 customers break at 100 and completely fail at 1,000. Implement systems now: CRM, customer success platforms, analytics, and automation tools. The right systems amplify your team's effectiveness exponentially.

**Revenue Optimization**: Don't just acquire new customers—maximize revenue from existing ones. Implement upsells, cross-sells, and annual plans. Expansion revenue from existing customers should eventually match or exceed new customer revenue.

Key metrics for this stage:

- **Growth Rate**: Aim for 15-20% month-over-month growth
- **CAC Payback**: Should be under 12 months
- **Net Revenue Retention**: Target 100%+ (expansion revenue offsets churn)
- **Gross Margin**: Should be above 70% for SaaS

## Stage 3: Market Leadership (Months 19+)

You're no longer the scrappy startup—you're an established player pursuing market leadership:

**Category Creation**: The strongest companies don't just compete in existing categories—they define new ones. Position your product as the solution to a category-level problem, not just a feature or tool.

**Brand Building**: Invest in brand. Produce authoritative content. Sponsor industry events. Build a community. Your brand becomes a moat that commodifies your competitors.

**Product Excellence**: Your product should now define the category. Continue innovating, but focus on depth over breadth. One excellent product beats three mediocre ones.

**Strategic Partnerships**: Form partnerships with established players who can accelerate your growth. Technology integrations, reseller agreements, and co-marketing can 10x your reach.

**Market Expansion**: With your core market established, carefully expand into adjacent markets. Use the same systematic validation approach that got you here—test, learn, optimize.

## The Critical Transitions

Three transitions trip up most companies:

**Founder to CEO**: The skills that make you a great founder differ from those needed to lead a scaled organization. Focus on vision, strategy, and culture. Delegate execution.

**Generalist Team to Specialized Roles**: Your early team wore many hats. As you scale, specialist roles (sales ops, marketing ops, customer success, etc.) become critical. Transition team members thoughtfully or hire specialists.

**Product Intuition to Data-Driven Decisions**: Early on, founder intuition drives product decisions. At scale, you need robust data and systematic experimentation. Build the infrastructure to collect, analyze, and act on data.

## Avoiding Common Pitfalls

Companies fail at scale for predictable reasons:

**Premature Scaling**: Growing team and costs before achieving unit economics and repeatable processes. Result: runway crisis and layoffs.

**Feature Bloat**: Adding features without removing complexity. Result: product becomes unfocused and hard to use.

**Culture Neglect**: Failing to intentionally build culture as you scale. Result: team dysfunction and talent loss.

**Competitive Obsession**: Reacting to every competitor move instead of staying focused on customers. Result: strategic drift.

## Your Growth Checklist

Review these milestones as you scale:

**$1M ARR**: Product-market fit confirmed. Core processes documented. First key hires made.

**$5M ARR**: Multiple growth channels working. Team of 20-30. Systems infrastructure in place.

**$10M ARR**: Strong brand presence. Established market position. Predictable growth model.

**$25M+ ARR**: Market leadership. Category defining. Building moats.

The journey from MVP to market leader is challenging but achievable. It requires discipline, patience, and relentless focus on customers. Companies that win don't do so by chance—they execute systematically on proven growth strategies while staying true to their core mission.

Your MVP was the beginning. Market leadership is built day by day, customer by customer, improvement by improvement. The companies that reach the top are simply the ones that refuse to stop climbing.`,
    imageUrl: insightGrowthRoadmap,
    author: {
      name: "Marcus Sterling - The Editor",
      avatar: authorMarcusSterling
    },
    category: "Growth & Scaling",
    publishedAt: "2025-09-18",
    readTime: "10 min read",
    highlights: [
      "Aim for 15-20% month-over-month growth",
      "LTV:CAC ratio of at least 3:1",
      "Target 100%+ net revenue retention"
    ],
    subtitles: [
      "Stage 1: Validation to Scale (Months 1-6)",
      "Stage 2: Building Your Growth Engine (Months 7-18)",
      "Stage 3: Market Leadership (Months 19+)",
      "The Critical Transitions",
      "Avoiding Common Pitfalls",
      "Your Growth Checklist"
    ]
  },
  {
    id: "4",
    title: "The Ultimate Guide to AI Automation for SaaS",
    slug: "ultimate-guide-ai-automation-saas",
    excerpt: "Implement intelligent automation that scales with your SaaS business. This comprehensive guide covers AI-powered workflows, integration patterns, and automation strategies that reduce operational costs by 70%.",
    content: `AI automation isn't just about efficiency—it's about fundamentally transforming how SaaS businesses operate and scale. This guide shows you how to implement automation that drives real results.

## Understanding AI Automation in SaaS

Traditional automation follows rigid rules: "if this happens, do that." AI automation is different—it learns, adapts, and improves over time. It handles complexity, understands context, and makes intelligent decisions that would otherwise require human judgment.

For SaaS businesses, this means automating tasks that were previously impossible to automate: qualifying leads with nuanced criteria, providing personalized customer support, predicting churn, optimizing pricing, and more.

## The Three Levels of SaaS Automation

**Level 1: Task Automation**

This is where most companies start. Individual repetitive tasks get automated: data entry, email sends, report generation, etc. These automations save time but don't fundamentally change how you operate.

Examples: Automated email sequences, data syncing between tools, scheduled report generation, basic chatbot responses.

Impact: 20-30% time savings on specific tasks. Moderate ROI.

**Level 2: Workflow Automation**

At this level, you're automating entire workflows that span multiple tasks and systems. These automations start to change how your business operates.

Examples: Lead qualification and routing, customer onboarding sequences, subscription management, support ticket triaging and resolution.

Impact: 40-60% reduction in time spent on routine workflows. High ROI.

**Level 3: Intelligent Systems**

The highest level combines multiple AI-powered workflows into cohesive systems that adapt and optimize automatically. These systems transform business models.

Examples: Predictive analytics driving proactive customer success, dynamic pricing based on market signals, AI agents handling customer interactions end-to-end, automated content generation and personalization.

Impact: 70%+ reduction in operational costs for automated functions. Transformational ROI.

## Key Areas for SaaS Automation

**Customer Acquisition**

AI automation can handle much of your customer acquisition funnel:

- **Lead Generation**: AI identifies and engages potential customers across multiple channels
- **Qualification**: Conversational AI asks questions and scores leads automatically
- **Nurturing**: Personalized content and outreach based on behavior and profile
- **Sales Assistance**: AI schedules meetings, provides context, and suggests actions

One mid-market SaaS company automated their entire top-of-funnel, increasing qualified leads by 300% while reducing cost per lead by 65%.

**Customer Onboarding**

First impressions matter. AI automation ensures every customer gets an excellent onboarding experience:

- **Personalized Walkthroughs**: AI adapts onboarding based on use case and role
- **Automated Training**: Proactive tips and education delivered at the right time
- **Health Monitoring**: AI tracks engagement and alerts success team of at-risk accounts
- **Configuration Assistance**: AI guides setup and suggests optimal configurations

Companies with AI-powered onboarding see 40% higher activation rates and 30% faster time-to-value.

**Customer Support**

This is where AI automation delivers immediate, obvious value:

- **24/7 Availability**: AI agents handle common questions around the clock
- **Intelligent Routing**: Complex issues reach the right human expert immediately
- **Predictive Support**: AI identifies potential issues before customers report them
- **Knowledge Base Optimization**: AI suggests improvements based on question patterns

Results: 70% of support tickets handled by AI, 85% reduction in response time, 40% improvement in CSAT scores.

**Revenue Operations**

AI optimizes the entire revenue engine:

- **Churn Prediction**: AI identifies at-risk accounts months before they churn
- **Expansion Identification**: AI spots upsell and cross-sell opportunities
- **Usage-Based Optimization**: AI suggests plan changes based on actual usage
- **Pricing Intelligence**: AI optimizes pricing based on willingness to pay and competitive positioning

One SaaS company reduced churn by 35% and increased expansion revenue by 60% with AI-powered revenue ops.

**Product Development**

AI informs product decisions with unprecedented clarity:

- **Feature Request Analysis**: AI categorizes and prioritizes thousands of requests
- **Usage Analytics**: AI identifies patterns in how customers use your product
- **A/B Test Optimization**: AI designs and analyzes experiments automatically
- **Bug Detection**: AI catches issues before they reach customers

## Implementation Strategy

**Phase 1: Foundation (Weeks 1-4)**

Start with data infrastructure. AI needs clean, accessible data to work effectively:

1. **Audit Your Data**: What data do you have? Where does it live? How clean is it?
2. **Integrate Systems**: Connect your core tools (CRM, support, product analytics, etc.)
3. **Define Metrics**: Establish baseline measurements for processes you'll automate
4. **Choose Quick Wins**: Identify 2-3 high-impact, low-complexity automation opportunities

**Phase 2: Initial Automations (Weeks 5-12)**

Deploy your first automations and learn from them:

1. **Start with Support**: Chatbots and ticket routing are proven wins
2. **Add Lead Qualification**: Automate initial lead interactions and scoring
3. **Implement Email Automation**: Personalized sequences for onboarding and engagement
4. **Monitor and Optimize**: Track metrics daily, iterate weekly

**Phase 3: Expansion (Months 4-12)**

With proven wins, expand systematically:

1. **Scale Successful Automations**: Apply proven patterns to additional use cases
2. **Add Complexity**: Move from simple tasks to complex workflows
3. **Integrate Predictive AI**: Add churn prediction, upsell identification, etc.
4. **Build Custom Solutions**: For unique needs, develop custom AI models

## Security and Compliance Considerations

AI automation introduces new security considerations:

**Data Protection**: Ensure AI systems handle customer data according to GDPR, CCPA, and other regulations. Implement encryption, access controls, and audit logs.

**AI Transparency**: Customers should know when they're interacting with AI. Be transparent about AI use and provide options to reach humans.

**Model Monitoring**: AI models can drift or develop biases. Implement monitoring to catch and correct issues quickly.

**Fallback Systems**: AI isn't perfect. Design systems with graceful degradation—when AI fails, human experts should seamlessly take over.

## Measuring Success

Track these key metrics:

**Efficiency Metrics**:
- Time saved per process
- Cost reduction per department
- Automation rate (% of tasks handled by AI)

**Quality Metrics**:
- Accuracy/error rates
- Customer satisfaction scores
- Employee satisfaction with AI tools

**Business Metrics**:
- Revenue impact
- Customer retention improvement
- Employee productivity gains

Most SaaS companies achieve:
- 40-60% cost reduction in automated functions
- 2-3x productivity improvement for augmented roles
- 200-400% ROI within first year

## The Future is Automated

AI automation in SaaS isn't experimental anymore—it's table stakes. Companies that automate intelligently gain massive advantages in efficiency, customer experience, and scalability.

The question isn't whether to implement AI automation but how quickly you can do it. Start small, learn fast, and scale what works. The companies that move fastest will dominate their markets.

Your competitors are automating. Your customers expect it. The technology is mature and accessible. The only question: when will you start?`,
    imageUrl: insightAiAutomationGuide,
    author: {
      name: "Marcus Sterling - The Editor",
      avatar: authorMarcusSterling
    },
    category: "AI & Innovation",
    publishedAt: "2025-08-22",
    readTime: "12 min read",
    highlights: [
      "70%+ reduction in operational costs",
      "40-60% cost reduction in automated functions",
      "200-400% ROI within first year"
    ],
    subtitles: [
      "Understanding AI Automation in SaaS",
      "The Three Levels of SaaS Automation",
      "Key Areas for SaaS Automation",
      "Implementation Strategy",
      "Security and Compliance Considerations",
      "Measuring Success",
      "The Future is Automated"
    ]
  },
  {
    id: "5",
    title: "Choosing the Right Tech Stack for Your MVP",
    slug: "choosing-right-tech-stack-mvp",
    excerpt: "Your tech stack decision will impact your MVP's speed, scalability, and success. Navigate the maze of frameworks, languages, and tools with this practical decision-making framework designed for startup founders.",
    content: `Your tech stack choice will influence your MVP's development speed, your ability to hire talent, your scaling costs, and ultimately your product's success. Here's how to choose wisely.

## The Stakes of This Decision

Choose the wrong stack and you'll face:
- Slower development than competitors
- Higher costs to build and maintain
- Difficulty hiring qualified developers
- Performance issues as you scale
- Expensive rewrites down the road

Choose the right stack and you'll enjoy:
- Rapid feature development
- Easy hiring from a large talent pool
- Predictable scaling costs
- Future-proof architecture
- Strong ecosystem support

The good news? There's no single "right" answer. The best stack depends on your specific situation—your team's skills, your product requirements, your timeline, and your scaling expectations.

## The Core Decision Framework

**1. Team Expertise**

The most important factor is often overlooked: what does your team know well? A mediocre tech stack executed expertly beats a perfect stack executed poorly.

If you're a solo founder with JavaScript experience, fighting that to learn Rust is probably unwise. If you have a Python backend engineer, fighting that to use Node.js creates unnecessary friction.

**Rule**: Choose technologies where your team has existing expertise, especially for your MVP. You can optimize later.

**2. Development Speed**

For MVPs, speed matters more than almost anything else. You need to validate your idea quickly before resources run out.

Frameworks and tools that accelerate development:
- **Modern Frameworks**: Next.js, Remix (React), Nuxt (Vue), SvelteKit
- **Backend-as-a-Service**: Supabase, Firebase, AWS Amplify
- **UI Component Libraries**: shadcn/ui, Chakra UI, Material-UI
- **Authentication**: Clerk, Auth0, NextAuth
- **Payments**: Stripe, Paddle

These tools let you build in weeks what used to take months.

**3. Scalability Needs**

Be realistic about scaling. You probably don't need to handle a million users on day one. You need to handle your first 100 users well, then your first 1,000.

Modern platforms scale remarkably well:
- Vercel handles massive traffic on their serverless infrastructure
- Supabase scales to millions of users
- Most SaaS apps never need custom infrastructure

**Rule**: Choose technologies that can scale to 10-100x your launch goals without major rewrites. Don't over-engineer for scaling you may never need.

**4. Hiring Availability**

If you plan to hire, consider the talent pool:

**Large Talent Pools**: JavaScript/TypeScript, Python, React, Node.js, PostgreSQL
**Moderate Pools**: Ruby (Rails), Go, Vue.js, MongoDB
**Smaller Pools**: Elixir, Rust, Svelte (though growing)

**Rule**: If hiring is critical, choose from the "large pool" options. If you're staying solo/small team long-term, choose what makes you most productive.

## Recommended Modern Stacks for SaaS MVPs

**The "Fast & Simple" Stack (Best for Most MVPs)**

Frontend: React with Next.js or Remix
Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Hosting: Vercel
Payments: Stripe
UI: Tailwind CSS + shadcn/ui

Why: Extremely fast development. Massive community. Excellent DX. Scales well. Easy hiring.

Time to MVP: 2-4 weeks for simple SaaS, 1-2 months for complex

**The "Full Control" Stack (For Teams with Backend Expertise)**

Frontend: React with Next.js
Backend: Node.js/Express or Python/FastAPI
Database: PostgreSQL (managed: RDS, Supabase, Neon)
Hosting: AWS/GCP or Railway/Render
Auth: Auth0 or custom
Payments: Stripe

Why: More control. Proven at scale. Flexible. Good for complex business logic.

Time to MVP: 1-2 months for simple SaaS, 2-4 months for complex

**The "AI-First" Stack (For AI-Powered Products)**

Frontend: React with Next.js
Backend: Python/FastAPI or Node.js
Database: PostgreSQL + Vector DB (Pinecone, Weaviate, or pgvector)
AI: OpenAI API, Anthropic, or open models
Hosting: Vercel + Railway/Modal

Why: Python excels for AI/ML. Vector databases for AI features. Fast iteration on AI capabilities.

Time to MVP: 2-4 weeks for AI-wrapper products, 2-3 months for custom AI features

## Key Technology Choices

**Frontend Framework**

React dominates SaaS. It has the largest ecosystem, most jobs, and best tooling. Vue is excellent too, especially for smaller teams. Svelte is emerging but has a smaller ecosystem.

**Recommendation**: React with Next.js unless your team strongly prefers Vue (use Nuxt) or Svelte (use SvelteKit).

**Backend Approach**

Three main options:

1. **Backend-as-a-Service (Supabase, Firebase)**: Fastest development. Great for MVPs. Can scale surprisingly far.

2. **Serverless (AWS Lambda, Vercel Edge)**: Pay per use. Scales automatically. Good for unpredictable traffic.

3. **Traditional API (Node, Python, Go)**: Maximum control. Best for complex business logic. Requires more setup.

**Recommendation**: Start with Backend-as-a-Service (Supabase) unless you have specific requirements that demand custom backend logic.

**Database**

PostgreSQL wins for SaaS. It's reliable, feature-rich, scales well, and has excellent tooling. It's the default choice unless you have specific needs.

MongoDB makes sense for certain use cases (highly unstructured data, rapid schema changes) but PostgreSQL handles most scenarios better.

**Recommendation**: PostgreSQL (via Supabase, Neon, or managed RDS).

**Hosting**

Modern platforms make hosting trivial:

- **Vercel**: Best for Next.js. Excellent DX. Generous free tier.
- **Netlify**: Great for static sites and JAMstack apps.
- **Railway**: Full-stack hosting. Databases included. Simple pricing.
- **Render**: Similar to Railway. Good PostgreSQL support.
- **AWS/GCP**: Maximum control but significant complexity.

**Recommendation**: Vercel for frontend, Supabase or Railway for backend/database.

## What About...

**TypeScript vs JavaScript?**

Use TypeScript. The improved developer experience and fewer bugs are worth the small learning curve. Modern frameworks have excellent TypeScript support.

**Monorepo vs Separate Repos?**

For MVPs, simple is better. Don't introduce monorepo complexity unless you have multiple apps that genuinely share significant code.

**Microservices?**

No. Not for MVPs. Maybe not ever for many SaaS products. Start with a well-organized monolith. You can always extract services later if needed.

**Native Mobile Apps?**

Build a responsive web app first. Only build native apps if you need platform-specific features (camera, GPS, etc.). Most SaaS products do fine with Progressive Web Apps (PWAs).

## The Decision Process

1. **List Your Requirements**: Features, integrations, performance needs, etc.

2. **Assess Your Team**: What do they know? What can they learn quickly?

3. **Define Timeline**: When do you need to launch?

4. **Pick Your Stack**: Use the decision framework above.

5. **Validate**: Ensure chosen technologies work together and meet requirements.

6. **Commit**: Once decided, commit fully. Don't second-guess endlessly.

## Red Flags to Avoid

- **Chasing Trends**: Don't use bleeding-edge tech for MVPs. Stability matters.
- **Resume-Driven Development**: Don't choose tech to learn it. Choose to ship fast.
- **Over-Engineering**: Don't build for scale you don't have yet.
- **Tool Fatigue**: Don't adopt every new tool. Stick with proven solutions.

## The Truth About Tech Stacks

Here's what matters: Execution beats technology choice almost every time. A focused team shipping features rapidly on a "suboptimal" stack will beat a team bikeshedding about the perfect stack.

Choose reasonable modern technologies. Then execute relentlessly. The companies that win aren't the ones with the best tech stack—they're the ones that ship the best products fastest.

Your tech stack is important, but it's not everything. Focus on solving customer problems, validating your market, and shipping quickly. The "perfect" stack won't save a bad product. A great product can succeed on almost any reasonable modern stack.

Choose wisely, but choose quickly. Then build.`,
    imageUrl: insightTechStackMvp,
    author: {
      name: "Marcus Sterling - The Editor",
      avatar: authorMarcusSterling
    },
    category: "Technical Guide",
    publishedAt: "2025-07-15",
    readTime: "9 min read",
    highlights: [
      "2-4 weeks to MVP with modern frameworks",
      "Choose based on team expertise, not trends",
      "PostgreSQL + React is the SaaS standard"
    ],
    subtitles: [
      "The Stakes of This Decision",
      "The Core Decision Framework",
      "Recommended Modern Stacks for SaaS MVPs",
      "Key Technology Choices",
      "The Decision Process",
      "Red Flags to Avoid",
      "The Truth About Tech Stacks"
    ]
  },
  {
    id: "6",
    title: "Market Validation: Know Before You Build",
    slug: "market-validation-know-before-build",
    excerpt: "Don't waste months building a product nobody wants. Master the art of market validation with proven techniques that separate winning ideas from expensive mistakes before you write a single line of code.",
    content: `The most expensive mistake in startups isn't building the wrong product—it's building any product before validating that people want it. Here's how to validate your market before investing significant time and money.

## Why Market Validation Matters

Every year, thousands of founders spend months building products that nobody wants. They invest time, money, and energy into features, infrastructure, and polish—only to discover there's no market for their solution.

The data is sobering: 42% of startups fail because there's no market need for their product. Not because of bad execution, poor marketing, or competitive pressure—simply because they built something people don't want.

Market validation flips this equation. It answers the critical question before you build: "Will people pay for this solution?" Getting this answer early—through real customer feedback, not assumptions—dramatically increases your odds of success.

## The Validation Mindset

Traditional thinking: "I have a great idea. I'll build it, then find customers."

Validation mindset: "I have a hypothesis. I'll find people with this problem, validate they'll pay to solve it, then build the minimum product they'll actually buy."

This shift is profound. You're not building your dream product—you're solving real customer problems that they'll pay to fix. Your opinion doesn't matter. Their willingness to pay does.

## Pre-Building Validation Methods

**1. Problem Validation Interviews**

Before thinking about solutions, validate that the problem is real and painful:

Talk to 20-50 people in your target market. Ask:
- "What's your biggest challenge with [problem area]?"
- "How are you solving this today?"
- "What have you tried that didn't work?"
- "How much time/money does this problem cost you?"

You're looking for consistency. If most people describe similar problems and frustrations, you're onto something. If everyone describes different problems, your market might be too broad or the problem might not be painful enough.

**Red flag**: People say "that's interesting" but can't articulate specific pain points or current workarounds.

**Green flag**: People get animated discussing the problem and mention they've already tried multiple solutions.

**2. Solution Validation (Before Building)**

Once you've confirmed the problem is real, validate your proposed solution:

Describe your solution (don't show mockups yet—they bias feedback). Ask:
- "Would this solve your problem?"
- "What's missing?"
- "Compared to your current solution, is this better?"
- "Would you pay for this?"

**Critical**: Ask about willingness to pay. If they won't commit to paying, they don't really have the problem or your solution doesn't truly solve it.

**3. Landing Page Validation**

Create a simple landing page describing your solution:
- Clear value proposition
- Key benefits
- Email signup or pre-order option
- Pricing (even if you're not ready to take money)

Drive targeted traffic (ads, social posts, communities) and measure:
- Click-through rates (how many visit?)
- Conversion rates (how many sign up?)
- Pre-orders (how many pay?)

**Benchmark**: 2-5% email signup rate is decent. 0.5-2% pre-order rate is strong validation.

Tools: Carrd, Webflow, or even a simple Google Doc styled as a landing page.

Cost: $100-500 for a week of testing.

**4. Fake Door Testing**

If you have existing traffic (website, audience, etc.), test interest with "fake doors":

Add a button or link for your proposed feature. When clicked, show a message: "We're still building this! Sign up to be notified when it's ready."

Measure: Click-through rate tells you how many people are interested enough to click. Sign-up rate tells you how many are seriously interested.

This validates feature prioritization before building anything.

**5. Pre-Selling**

The strongest validation is money. Sell your product before building it:

Approach potential customers with your concept. Offer a significant discount (50%+ off future price) for early adopters who pre-pay.

"I'm building [solution] for [problem]. It will cost $X when launched. I'm offering founding customers 60% off—$Y—if they commit now. Are you interested?"

If you can get 5-10 pre-sales, you have strong validation. If you can't get anyone to pre-pay even at 60% off, reconsider whether the problem is painful enough.

## Validation Metrics That Matter

**Qualitative Signals**:
- Consistent problem descriptions across interviews
- Emotion when discussing the problem
- Current workarounds and attempted solutions
- Willingness to pay before seeing the product

**Quantitative Signals**:
- Landing page conversion rate >2%
- Pre-order rate >0.5%
- Email open/response rates to cold outreach
- Time from first contact to commitment

**The Gold Standard**: Getting paid before building anything.

## Red Flags to Watch For

**"That's a cool idea"**

Translation: "I'm being polite but wouldn't actually use this." Look for "I need this!" not "that's nice."

**"I might use this"**

"Might" means no. You want "absolutely" or "when can I get it?"

**"I'd pay $X for this" (during interview)**

Unless they actually pay $X, discount this heavily. Hypothetical willingness to pay is usually much higher than actual willingness.

**Too Many Features Requested**

If everyone wants something different, you haven't found a focused problem or your market is too broad.

**"Just add [feature], then I'll buy"**

Serial feature requests often mean the core value proposition isn't strong enough.

## What Good Validation Looks Like

**Buffer (social media tool)**: Leo built a landing page describing Buffer before building anything. He drove traffic and measured signups. Strong response validated demand. He built a simple version in weeks and launched with paying customers.

**Dropbox**: Drew created a video showing how Dropbox would work. The video went viral. Waiting list grew from 5,000 to 75,000 overnight. Clear validation that people wanted seamless file syncing.

**Wise (formerly TransferWise)**: Founders validated by manually matching people who needed to transfer money between currencies. Once they proved the model worked, they built the automated system.

## The Validation Process

**Week 1-2: Problem Research**
- Identify target market
- Conduct 20-30 problem interviews
- Document pain points and current solutions
- Validate problem is real and painful

**Week 3-4: Solution Validation**
- Develop solution hypothesis
- Validate solution with 10-20 follow-up interviews
- Refine based on feedback
- Create simple positioning/messaging

**Week 5-6: Market Test**
- Build landing page
- Create signup or pre-order flow
- Drive targeted traffic (ads, communities, outreach)
- Measure conversion rates

**Week 7-8: Pre-Selling**
- Approach most interested prospects
- Attempt to close pre-sales
- Refine pitch based on objections
- Set launch timeline with early customers

**Goal**: 10-20 pre-sales or 200+ qualified email signups before building.

## When to Pivot vs. Persevere

**Pivot signals**:
- No consistent problem description
- Low engagement in interviews
- Landing page conversion <1%
- Unable to close any pre-sales
- Requested features completely change your product concept

**Persevere signals**:
- Consistent problem validation
- Multiple people volunteering to pay
- Strong engagement and emotion in interviews
- Landing page conversion >2%
- Feature requests refine vs. redefine the product

## The Truth About Validation

Market validation isn't about getting permission to build. It's about de-risking your investment of time and money. It's about learning what people really want before committing months to building.

Perfect validation is impossible. You'll still face surprises post-launch. But good validation dramatically increases your odds of building something people actually want to buy.

The companies that succeed aren't the ones with the best ideas—they're the ones that validate and iterate fastest. They talk to customers constantly. They test before building. They sell before scaling.

Your market is telling you what to build. The question is: are you listening?

Don't build in a vacuum. Validate first. Build second. Scale third. This order matters more than almost any other decision you'll make.`,
    imageUrl: insightMarketValidation,
    author: {
      name: "Marcus Sterling - The Editor",
      avatar: authorMarcusSterling
    },
    category: "Business Strategy",
    publishedAt: "2025-06-01",
    readTime: "8 min read",
    highlights: [
      "42% of startups fail due to no market need",
      "2-5% email signup rate validates interest",
      "Pre-selling is the gold standard validation"
    ],
    subtitles: [
      "Why Market Validation Matters",
      "The Validation Mindset",
      "Pre-Building Validation Methods",
      "Validation Metrics That Matter",
      "Red Flags to Watch For",
      "What Good Validation Looks Like",
      "The Validation Process",
      "When to Pivot vs. Persevere",
      "The Truth About Validation"
    ]
  }
];

const Newsletter = () => {
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: dbPosts = [], isLoading: isLoadingPosts } = useNewsletterPosts();

  // Combine DB posts (first) with mock posts as fallback, dedup by slug
  const allPosts = useMemo(() => {
    const slugSet = new Set(dbPosts.map(p => p.slug));
    const uniqueMockPosts = mockPosts.filter(p => !slugSet.has(p.slug));
    return [...dbPosts, ...uniqueMockPosts];
  }, [dbPosts]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailValue = watch("email");
  const emailCharCount = emailValue?.length || 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Extract unique categories
  const allCategories = ["All Categories", ...Array.from(new Set(allPosts.map(post => post.category)))];

  // Filter posts based on search and category, then sort chronologically
  const filteredPosts = allPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      
      // Sort based on direction: asc = oldest first, desc = newest first
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const onNewsletterSubmit = async (data: NewsletterFormData) => {
    try {
      const sanitizedEmail = data.email.trim().toLowerCase();

      // First, try to insert into Supabase
      const { error: dbError } = await supabase
        .from('tb_web_newsletter')
        .insert({ 
          email: sanitizedEmail, 
          source: 'newsletter_hero' 
        });

      // Handle duplicate email error
      if (dbError?.code === '23505') {
        console.log("Email already subscribed");
        return;
      }

      if (dbError) {
        throw dbError;
      }
      
      // Send welcome email (best-effort, don't block success)
      supabase.functions.invoke('send-newsletter-welcome', {
        body: { email: sanitizedEmail, source: 'newsletter_hero' }
      }).then(({ error }) => {
        if (error) console.error('Welcome email error:', error);
      }).catch(err => console.error('Welcome email fetch error:', err));

      // Call the webhook
      fetch(
        "https://uaicode-n8n.ax5vln.easypanel.host/webhook/a95bfd22-a4e0-48b2-b88d-bec4bfe84be4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: sanitizedEmail,
            timestamp: new Date().toISOString(),
            source: "newsletter_hero",
          }),
        }
      ).catch(err => console.error('Webhook error:', err));

      // Show success dialog
      reset();
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    }
  };

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <NewsletterSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  UAICODE <span className="text-gradient-gold">INSIGHTS</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Expert insights, practical guides, and industry trends to help you build and scale your SaaS products
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit(onNewsletterSubmit)} className="space-y-4">
                <div className="glass-card p-6 rounded-xl space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...register("email")}
                        className="pl-12 py-6 text-lg bg-background/50 border-border"
                        disabled={isSubmitting}
                        maxLength={255}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{emailCharCount}/255 characters</p>
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    By signing up I accept the terms of the{" "}
                    <Link to="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link to="/terms" className="text-accent hover:underline">
                      Terms of Use
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08]">
                <img
                  src={heroImage}
                  alt="AI Newsletter Hero"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Latest <span className="text-gradient-gold">Insights</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Expert perspectives on AI, automation, and business transformation
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* Search Bar */}
              <div className="w-full md:w-96">
                <Input
                  type="text"
                  placeholder="Search posts by title..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                />
              </div>
              
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort Direction Toggle */}
              <Button
                variant="outline"
                onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                className="w-full md:w-auto flex items-center gap-2"
              >
                {sortDirection === "asc" ? (
                  <>
                    <ArrowUpNarrowWide className="h-4 w-4" />
                    <span>Oldest First</span>
                  </>
                ) : (
                  <>
                    <ArrowDownNarrowWide className="h-4 w-4" />
                    <span>Newest First</span>
                  </>
                )}
              </Button>
              
              {/* Posts Per Page Selector */}
              <Select
                value={postsPerPage.toString()}
                onValueChange={(value) => {
                  setPostsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 posts per page</SelectItem>
                <SelectItem value="6">6 posts per page</SelectItem>
                <SelectItem value="9">9 posts per page</SelectItem>
                <SelectItem value="12">12 posts per page</SelectItem>
              </SelectContent>
              </Select>
            </div>
            
            {/* Results Count */}
            <p className="text-sm text-muted-foreground text-center">
              Showing {currentPosts.length} of {filteredPosts.length} posts
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <BlogCard key={post.id} post={post} onClick={() => handleBlogClick(post.slug)} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No posts found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* More Ways to Learn Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              More Ways to <span className="text-gradient-gold">Learn</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our video tutorials and podcast episodes for deeper insights into AI, automation, and SaaS development
            </p>
          </div>

          {/* Platform Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* YouTube Card */}
            <a 
              href="https://www.youtube.com/@uaicodeai"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 rounded-2xl hover-lift transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <Youtube className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Watch on YouTube</h3>
                <p className="text-muted-foreground">
                  Video tutorials, case studies, and expert insights on AI-powered MVP development
                </p>
                <div className="flex items-center text-accent font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  Visit Channel
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </a>

            {/* Spotify Card */}
            <a 
              href="https://open.spotify.com/show/0TzK81gwC16gvPkLhIVzXg"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 rounded-2xl hover-lift transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <Radio className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Listen on Spotify</h3>
                <p className="text-muted-foreground">
                  Podcast episodes featuring founder stories, industry trends, and practical advice
                </p>
                <div className="flex items-center text-accent font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  Listen Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Newsletter;
