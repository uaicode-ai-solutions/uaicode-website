import { useState } from "react";
import { useHeroUsers, HeroUserWithRoles } from "@/hooks/useHeroUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Pencil, Trash2 } from "lucide-react";
import InviteUserDialog from "./InviteUserDialog";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";

const HeroUserManagement = () => {
  const { data: users, isLoading, error } = useHeroUsers();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<HeroUserWithRoles | null>(null);
  const [deletingUser, setDeletingUser] = useState<HeroUserWithRoles | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-white/[0.04]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <p className="text-sm text-red-400">Failed to load users.</p>
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-12 flex flex-col items-center gap-3">
          <Users className="w-8 h-8 text-white/20" />
          <p className="text-sm text-white/40">No users found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <Button onClick={() => setInviteOpen(true)} className="bg-uai-500 text-black hover:bg-uai-400 gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </div>
      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <EditUserDialog user={editingUser} open={!!editingUser} onOpenChange={(o) => !o && setEditingUser(null)} />
      <DeleteUserDialog user={deletingUser} open={!!deletingUser} onOpenChange={(o) => !o && setDeletingUser(null)} />
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Team</th>
              <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-sm text-white">{u.full_name || "—"}</td>
                <td className="px-6 py-4 text-sm text-white/60">{u.email}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5">
                    {u.roles.length > 0 ? u.roles.map((role) => (
                      <span key={role} className="text-xs px-2 py-1 rounded-full bg-uai-500/10 text-uai-500 capitalize">{role}</span>
                    )) : (
                      <span className="text-xs text-white/30">No role</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${u.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white/60 capitalize">{u.team === "none" ? "—" : u.team}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => setEditingUser(u)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeletingUser(u)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeroUserManagement;
