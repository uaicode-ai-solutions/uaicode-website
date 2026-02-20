import { useState } from "react";
import { useHeroUsers } from "@/hooks/useHeroUsers";
import { UserPlus, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const roleBadge: Record<string, string> = {
  admin: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  contributor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  viewer: "bg-white/5 text-white/50 border-white/10",
};

const UserManagement = () => {
  const { users, isLoading, inviteUser, isInviting } = useHeroUsers();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [team, setTeam] = useState("marketing");

  const handleInvite = () => {
    if (!email) return;
    inviteUser(
      { email, role, team },
      {
        onSuccess: () => {
          setOpen(false);
          setEmail("");
          setRole("viewer");
          setTeam("marketing");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-uai-500 hover:bg-uai-600 text-black font-semibold gap-2">
              <UserPlus className="w-4 h-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-white/70">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/[0.08]">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="contributor">Contributor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Team</Label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/[0.08]">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" className="text-white/60">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleInvite}
                disabled={!email || isInviting}
                className="bg-uai-500 hover:bg-uai-600 text-black font-semibold"
              >
                {isInviting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Team</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/30 text-sm">
                  No users found
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-6 py-4 text-sm text-white">{u.full_name || "—"}</td>
                <td className="px-6 py-4 text-sm text-white/60">{u.email}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5">
                    {u.roles.map((r) => (
                      <span
                        key={r}
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border capitalize",
                          roleBadge[r] || roleBadge.viewer
                        )}
                      >
                        {r}
                      </span>
                    ))}
                    {u.roles.length === 0 && (
                      <span className="text-xs text-white/30">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-white/60 capitalize">{u.team}</td>
                <td className="px-6 py-4">
                  {u.status === "active" ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      Pending Invite
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
