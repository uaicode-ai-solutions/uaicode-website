import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Loader2 } from "lucide-react";
import { HeroUserWithRoles } from "@/hooks/useHeroUsers";

interface EditUserDialogProps {
  user: HeroUserWithRoles | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditUserDialog = ({ user, open, onOpenChange }: EditUserDialogProps) => {
  const [role, setRole] = useState("viewer");
  const [team, setTeam] = useState("none");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setRole(user.roles[0] || "viewer");
      setTeam(user.team || "none");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Delete existing roles then insert new one
      await (supabase.from("tb_hero_roles" as any).delete() as any).eq("user_id", user.id);
      const { error: roleError } = await (supabase.from("tb_hero_roles" as any).insert({ user_id: user.id, role }) as any);
      if (roleError) throw roleError;

      // Update team
      const { error: teamError } = await (supabase.from("tb_hero_users" as any).update({ team }) as any).eq("id", user.id);
      if (teamError) throw teamError;

      toast.success(`${user.email} updated successfully.`);
      queryClient.invalidateQueries({ queryKey: ["hero-users"] });
      onOpenChange(false);
    } catch (err: any) {
      console.error("Edit user error:", err);
      toast.error(err.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-white/[0.06] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Pencil className="w-5 h-5 text-uai-500" />
            Edit User
          </DialogTitle>
          <DialogDescription className="text-white/50">
            {user?.full_name || user?.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-white/70">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
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
              <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white">Cancel</Button>
          <Button onClick={handleSave} disabled={loading} className="bg-uai-500 text-black hover:bg-uai-400">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
