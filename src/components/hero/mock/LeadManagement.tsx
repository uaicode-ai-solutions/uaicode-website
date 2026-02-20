import { UserCheck, Search } from "lucide-react";

const LeadManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Lead Management</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search leads..."
              className="pl-9 pr-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 w-64"
              disabled
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Source</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-sm text-white/40">No leads yet</p>
                  <p className="text-xs text-white/20">Leads will appear here as they come in</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadManagement;
