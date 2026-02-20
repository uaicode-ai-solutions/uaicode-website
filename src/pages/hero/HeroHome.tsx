import { useNavigate } from "react-router-dom";
import { useHeroAuth } from "@/hooks/useHeroAuth";
import HeroHeader from "@/components/hero/HeroHeader";
import {
  Shield, Megaphone, BarChart3, Lock,
  Users, FileText, Zap, BookOpen,
  ExternalLink,
} from "lucide-react";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const subsystems = [
  {
    id: "admin",
    label: "Admin",
    description: "User management, system settings, and activity monitoring.",
    icon: Shield,
    hash: "#admin",
    defaultView: "admin-overview",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Content calendar, social media analytics, and campaign management.",
    icon: Megaphone,
    hash: "#marketing",
    defaultView: "mkt-social",
  },
  {
    id: "sales",
    label: "Sales",
    description: "Pipeline tracking, lead management, CRM, and revenue analytics.",
    icon: BarChart3,
    hash: "#sales",
    defaultView: "sales-pipeline",
  },
];

const quickStats = [
  { label: "Team Members", value: "24", icon: Users },
  { label: "Reports Generated", value: "187", icon: FileText },
  { label: "Active Leads", value: "67", icon: Zap },
];

const newsItems = [
  { title: "Company Values Update", excerpt: "Our refreshed mission and vision for 2026.", date: "Feb 18" },
  { title: "New AI Tools Available", excerpt: "Check out the latest internal tools powered by AI.", date: "Feb 15" },
  { title: "Team Building Event", excerpt: "March retreat planning is underway!", date: "Feb 12" },
];

const usefulLinks = [
  { label: "Brand Guidelines", url: "#" },
  { label: "Knowledge Base", url: "#" },
  { label: "HR Portal", url: "#" },
  { label: "IT Support", url: "#" },
];

const HeroHome = () => {
  const navigate = useNavigate();
  const { heroUser, canAccessSubsystem } = useHeroAuth();

  const firstName = heroUser?.full_name?.split(" ")[0] || "Hero";

  return (
    <div className="min-h-screen bg-black">
      <HeroHeader />

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* Welcome Banner */}
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-uai-500/5 via-transparent to-transparent" />
          <div className="relative">
            <p className="text-uai-500 text-sm font-medium mb-1">{getGreeting()}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Welcome back, <span className="text-uai-500">{firstName}</span>
            </h1>
            <p className="text-white/50 mt-2 max-w-lg">
              Access your tools and dashboards from the Hero Ecosystem.
            </p>
          </div>
        </div>

        {/* Subsystem Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Workspaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {subsystems.map((s) => {
              const Icon = s.icon;
              const hasAccess = canAccessSubsystem(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => hasAccess && navigate(`/hero/dash?view=${s.defaultView}`)}
                  disabled={!hasAccess}
                  className={`relative group text-left rounded-xl border p-6 transition-all duration-300 ${
                    hasAccess
                      ? "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-uai-500/20 hover:-translate-y-0.5 cursor-pointer"
                      : "border-white/[0.04] bg-white/[0.01] opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasAccess ? "bg-uai-500/10" : "bg-white/[0.04]"}`}>
                      {hasAccess ? <Icon className="w-5 h-5 text-uai-500" /> : <Lock className="w-5 h-5 text-white/20" />}
                    </div>
                    <h3 className="text-white font-semibold">{s.label}</h3>
                  </div>
                  <p className="text-sm text-white/40">{s.description}</p>
                  {!hasAccess && (
                    <p className="text-xs text-white/20 mt-3">Access restricted</p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
                <Icon className="w-5 h-5 text-uai-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
                <p className="text-xs text-white/40 mt-1">{s.label}</p>
              </div>
            );
          })}
        </section>

        {/* News + Useful Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-uai-500" /> Internal News
            </h2>
            <div className="space-y-3">
              {newsItems.map((n, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-medium">{n.title}</h3>
                      <p className="text-sm text-white/40 mt-1">{n.excerpt}</p>
                    </div>
                    <span className="text-xs text-white/25 shrink-0 ml-4">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Quick Links</h2>
            <div className="space-y-2">
              {usefulLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors text-white/60 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 text-uai-500/60" />
                  <span className="text-sm">{l.label}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HeroHome;
