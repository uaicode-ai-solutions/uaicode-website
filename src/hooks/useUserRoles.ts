import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

export type AppRole = "user" | "admin" | "contributor";

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const useUserRoles = () => {
  const { pmsUser } = useAuthContext();
  const queryClient = useQueryClient();

  // Fetch current user's roles
  const { data: userRoles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ["user-roles", pmsUser?.id],
    queryFn: async () => {
      if (!pmsUser?.id) return [];
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", pmsUser.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        return [];
      }

      return data as UserRole[];
    },
    enabled: !!pmsUser?.id,
  });

  // Check if current user is admin
  const isAdmin = userRoles.some((r) => r.role === "admin");
  const isContributor = userRoles.some((r) => r.role === "contributor");

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data, error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  return {
    userRoles,
    isLoadingRoles,
    isAdmin,
    isContributor,
    addRole: addRoleMutation.mutateAsync,
    removeRole: removeRoleMutation.mutateAsync,
    isAddingRole: addRoleMutation.isPending,
    isRemovingRole: removeRoleMutation.isPending,
  };
};
