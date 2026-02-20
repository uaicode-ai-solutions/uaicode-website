import { Calendar, Share2, Megaphone, Palette, TrendingUp, Eye, Heart } from "lucide-react";

const socialStats = [
  { label: "Impressions", value: "45.2K", icon: Eye, change: "+18%" },
  { label: "Engagement", value: "3.8%", icon: Heart, change: "+0.4%" },
  { label: "Followers", value: "12.4K", icon: TrendingUp, change: "+320" },
  { label: "Posts This Month", value: "28", icon: Share2, change: "on track" },
];

const campaigns = [
  { name: "Q1 Product Launch", status: "Active", budget: "$5,000", reach: "25K" },
  { name: "Brand Awareness Series", status: "Planned", budget: "$3,200", reach: "–" },
  { name: "Customer Success Stories", status: "Active", budget: "$1,800", reach: "12K" },
];

const calendarEvents = [
  { date: "Feb 21", title: "Blog: AI Trends 2026", status: "Draft" },
  { date: "Feb 23", title: "Instagram Carousel: UaiCode Values", status: "Scheduled" },
  { date: "Feb 25", title: "LinkedIn Article: SaaS Growth", status: "In Review" },
  { date: "Feb 28", title: "Newsletter: Monthly Recap", status: "Planned" },
];

interface MarketingOverviewProps {
  view: string;
}

const MarketingOverview = ({ view }: MarketingOverviewProps) => {
  if (view === "mkt-calendar") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Content Calendar</h2>
        <div className="space-y-3">
          {calendarEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
              <div className="w-16 text-center">
                <p className="text-xs text-amber-500 font-semibold">{e.date}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{e.title}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-white/[0.06] text-white/50">{e.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "mkt-campaigns") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Campaign Manager</h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Campaign</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Budget</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Reach</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.name} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-sm text-white">{c.name}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${c.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.06] text-white/50"}`}>{c.status}</span></td>
                  <td className="px-6 py-4 text-sm text-white/60 font-mono">{c.budget}</td>
                  <td className="px-6 py-4 text-sm text-white/60 font-mono">{c.reach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === "mkt-brand") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Brand Assets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Logo Pack", "Color Palette", "Typography Guide", "Social Templates"].map((asset) => (
            <div key={asset} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">{asset}</h3>
                <p className="text-xs text-white/40">Download or view</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: mkt-social
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Social Media Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {socialStats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-sm text-white/50">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
              <p className="text-xs text-emerald-400 mt-1">{s.change}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketingOverview;
