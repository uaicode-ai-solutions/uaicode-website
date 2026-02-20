import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HeroUser {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  team: string;
  created_at: string;
}

interface HeroRole {
  id: string;
  user_id: string;
  role: string;
}

export interface HeroUserWithRole extends HeroUser {
  roles: string[];
  status: "active" | "pending";
}

export const useHeroUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["hero-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_hero_users" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as any as HeroUser[]) || [];
    },
  });

  const rolesQuery = useQuery({
    queryKey: ["hero-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_hero_roles" as any)
        .select("*");

      if (error) throw error;
      return (data as any as HeroRole[]) || [];
    },
  });

  const usersWithRoles: HeroUserWithRole[] = (usersQuery.data || []).map((user) => {
    const userRoles = (rolesQuery.data || [])
      .filter((r) => r.user_id === user.id)
      .map((r) => r.role);

    return {
      ...user,
      roles: userRoles,
      status: user.full_name ? "active" : "pending",
    };
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ email, role, team }: { email: string; role: string; team: string }) => {
      const { data, error } = await supabase.functions.invoke("hero-invite-user", {
        body: { email, role, team },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Invitation sent!");
      queryClient.invalidateQueries({ queryKey: ["hero-users"] });
      queryClient.invalidateQueries({ queryKey: ["hero-roles"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to send invitation");
    },
  });

  return {
    users: usersWithRoles,
    isLoading: usersQuery.isLoading || rolesQuery.isLoading,
    inviteUser: inviteMutation.mutate,
    isInviting: inviteMutation.isPending,
  };
};
