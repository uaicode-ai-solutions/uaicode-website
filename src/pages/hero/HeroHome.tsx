import { useNavigate } from "react-router-dom";
import { useHeroAuth } from "@/hooks/useHeroAuth";
import HeroHeader from "@/components/hero/HeroHeader";
import { Lock } from "lucide-react";

import shieldAdmin from "@/assets/shield-admin.png";
import shieldMarketing from "@/assets/shield-marketing.png";
import shieldSales from "@/assets/shield-sales.png";
import shieldProduct from "@/assets/shield-product.png";
import shieldEducation from "@/assets/shield-education.png";
import shieldTech from "@/assets/shield-tech.png";

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
    shield: shieldAdmin,
    hash: "#admin",
    defaultView: "admin-overview",
    comingSoon: false,
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Content calendar, social media analytics, and campaign management.",
    shield: shieldMarketing,
    hash: "#marketing",
    defaultView: "mkt-social",
    comingSoon: false,
  },
  {
    id: "sales",
    label: "Sales",
    description: "Pipeline tracking, lead management, CRM, and revenue analytics.",
    shield: shieldSales,
    hash: "#sales",
    defaultView: "sales-pipeline",
    comingSoon: false,
  },
  {
    id: "product",
    label: "Product",
    description: "Roadmap planning, feature prioritization, and product analytics.",
    shield: shieldProduct,
    hash: "#product",
    defaultView: "",
    comingSoon: true,
  },
  {
    id: "education",
    label: "Education",
    description: "Courses, learning paths, certifications, and knowledge base.",
    shield: shieldEducation,
    hash: "#education",
    defaultView: "",
    comingSoon: true,
  },
  {
    id: "tech",
    label: "Tech",
    description: "Infrastructure monitoring, deployments, and technical operations.",
    shield: shieldTech,
    hash: "#tech",
    defaultView: "",
    comingSoon: true,
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subsystems.map((s) => {
              const hasAccess = canAccessSubsystem(s.id);
              const isClickable = hasAccess && !s.comingSoon;
              return (
                <button
                  key={s.id}
                  onClick={() => isClickable && navigate(`/hero/dash?view=${s.defaultView}`)}
                  disabled={!isClickable}
                  className={`relative group text-left rounded-xl border p-6 transition-all duration-300 ${
                    isClickable
                      ? "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-uai-500/20 hover:-translate-y-0.5 cursor-pointer"
                      : "border-white/[0.04] bg-white/[0.01] opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                      {hasAccess ? (
                        <img src={s.shield} alt={`${s.label} shield`} className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          <Lock className="w-5 h-5 text-white/20" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{s.label}</h3>
                      {s.comingSoon && (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-uai-500/70">Coming soon</span>
                      )}
                    </div>
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
