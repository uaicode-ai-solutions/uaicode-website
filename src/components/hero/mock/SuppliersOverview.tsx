import { Truck, FileCheck, Clock, Star } from "lucide-react";

const stats = [
  { label: "Total Suppliers", value: "0", icon: Truck, change: "—" },
  { label: "Active Contracts", value: "0", icon: FileCheck, change: "—" },
  { label: "Pending Approvals", value: "0", icon: Clock, change: "—" },
  { label: "Avg Rating", value: "0", icon: Star, change: "—" },
];

const SuppliersOverview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Suppliers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-uai-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-uai-500" />
                </div>
                <span className="text-sm text-white/50">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
              <p className="text-xs text-white/30 mt-1">{s.change}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuppliersOverview;
