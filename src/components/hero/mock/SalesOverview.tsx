import { BarChart3, UserCheck, FileText, Database, DollarSign, Target, TrendingUp, Clock } from "lucide-react";

const pipelineStats = [
  { label: "Pipeline Value", value: "$142K", icon: DollarSign, change: "+$23K" },
  { label: "Active Leads", value: "67", icon: Target, change: "+8 this week" },
  { label: "Win Rate", value: "34%", icon: TrendingUp, change: "+2%" },
  { label: "Avg Close Time", value: "18 days", icon: Clock, change: "-3 days" },
];

const leads = [
  { name: "TechVenture Inc.", contact: "John Smith", stage: "Proposal", value: "$25,000" },
  { name: "GrowthLab.io", contact: "Sarah Johnson", stage: "Negotiation", value: "$18,500" },
  { name: "DataFlow Corp", contact: "Mike Brown", stage: "Discovery", value: "$32,000" },
  { name: "CloudScale", contact: "Emma Wilson", stage: "Qualification", value: "$12,000" },
];

const stageColors: Record<string, string> = {
  Proposal: "bg-blue-500/10 text-blue-400",
  Negotiation: "bg-uai-500/10 text-uai-500",
  Discovery: "bg-purple-500/10 text-purple-400",
  Qualification: "bg-emerald-500/10 text-emerald-400",
};

interface SalesOverviewProps {
  view: string;
}

const SalesOverview = ({ view }: SalesOverviewProps) => {
  if (view === "sales-leads") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Lead Management</h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Stage</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Value</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.name} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-sm text-white">{l.name}</td>
                  <td className="px-6 py-4 text-sm text-white/60">{l.contact}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${stageColors[l.stage]}`}>{l.stage}</span></td>
                  <td className="px-6 py-4 text-sm text-white font-mono">{l.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (view === "sales-reports") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["Monthly Revenue Report", "Lead Conversion Analysis", "Team Performance", "Forecast vs Actual"].map((r) => (
            <div key={r} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors cursor-pointer">
              <FileText className="w-5 h-5 text-uai-500 mb-3" />
              <h3 className="text-white font-medium">{r}</h3>
              <p className="text-xs text-white/40 mt-1">View report →</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "sales-crm") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">CRM Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Contacts", value: "312" },
            { label: "Companies", value: "89" },
            { label: "Deals Open", value: "23" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
              <p className="text-3xl font-bold text-white font-mono">{s.value}</p>
              <p className="text-sm text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: sales-pipeline
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Pipeline Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineStats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-uai-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-uai-500" />
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

export default SalesOverview;
