import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InviteUserDialog = ({ open, onOpenChange }: InviteUserDialogProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("viewer");
  const [team, setTeam] = useState<string>("none");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("hero-invite-user", {
        body: { email: trimmedEmail, role, team },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`${trimmedEmail} has been invited as ${role}.`);
      queryClient.invalidateQueries({ queryKey: ["hero-users"] });
      setEmail("");
      setRole("viewer");
      setTeam("none");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141414] border-white/[0.06] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-uai-500" />
            Invite User
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Send an invitation to join the Hero Ecosystem.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-white/70">Email</Label>
            <Input
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
            />
          </div>

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
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/50 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-uai-500 text-black hover:bg-uai-400">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
