import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { HeroUserWithRoles } from "@/hooks/useHeroUsers";

interface DeleteUserDialogProps {
  user: HeroUserWithRoles | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteUserDialog = ({ user, open, onOpenChange }: DeleteUserDialogProps) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Delete roles first (FK dependency)
      await (supabase.from("tb_hero_roles" as any).delete() as any).eq("user_id", user.id);
      const { error } = await (supabase.from("tb_hero_users" as any).delete() as any).eq("id", user.id);
      if (error) throw error;

      toast.success(`${user.email} has been removed.`);
      queryClient.invalidateQueries({ queryKey: ["hero-users"] });
      onOpenChange(false);
    } catch (err: any) {
      console.error("Delete user error:", err);
      toast.error(err.message || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#141414] border-white/[0.06] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
          <AlertDialogDescription className="text-white/50">
            Are you sure you want to remove <strong className="text-white">{user?.full_name || user?.email}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/[0.04] border-white/[0.08] text-white hover:bg-white/[0.08] hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
