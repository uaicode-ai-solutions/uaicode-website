import { useNavigate } from "react-router-dom";
import { useHeroAuth } from "@/hooks/useHeroAuth";
import HeroHeader from "@/components/hero/HeroHeader";
import {
  Shield, Megaphone, BarChart3, Lock,
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

      </main>
    </div>
  );
};

export default HeroHome;
