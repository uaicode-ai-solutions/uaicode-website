import { Users, FileText, Activity, Server } from "lucide-react";
import HeroUserManagement from "@/components/hero/admin/HeroUserManagement";

const stats = [
  { label: "Total Users", value: "24", icon: Users, change: "+3 this week" },
  { label: "Reports Generated", value: "187", icon: FileText, change: "+12 today" },
  { label: "Active Sessions", value: "8", icon: Activity, change: "live" },
  { label: "System Uptime", value: "99.9%", icon: Server, change: "last 30 days" },
];


const activityLogs = [
  { action: "User login", user: "Rafael Luz", time: "2 min ago" },
  { action: "Report generated", user: "Ana Silva", time: "15 min ago" },
  { action: "Settings updated", user: "Rafael Luz", time: "1 hour ago" },
  { action: "New user added", user: "System", time: "3 hours ago" },
];

interface AdminOverviewProps {
  view: string;
}

const AdminOverview = ({ view }: AdminOverviewProps) => {
  if (view === "admin-users") {
    return <HeroUserManagement />;
  }

  if (view === "admin-settings") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">System Settings</h2>
        <div className="grid gap-4">
          {["General", "Security", "Notifications", "Integrations"].map((section) => (
            <div key={section} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors cursor-pointer">
              <h3 className="text-white font-medium">{section}</h3>
              <p className="text-sm text-white/40 mt-1">Configure {section.toLowerCase()} settings</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "admin-logs") {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Activity Logs</h2>
        <div className="space-y-3">
          {activityLogs.map((log, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div>
                <p className="text-sm text-white">{log.action}</p>
                <p className="text-xs text-white/40">{log.user}</p>
              </div>
              <span className="text-xs text-white/30">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: admin-overview
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Admin Overview</h2>
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

export default AdminOverview;
