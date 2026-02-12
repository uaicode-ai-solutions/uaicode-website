import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "./useUserRoles";

interface PmsUser {
  id: string;
  auth_user_id: string;
  email: string;
  username: string | null;
  full_name: string;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface UserWithRoles extends PmsUser {
  roles: AppRole[];
}

export const useAdminUsers = () => {
  // Fetch all users (only works if current user is admin due to RLS)
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from("tb_pms_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) {
        console.error("Error fetching users:", usersError);
        throw usersError;
      }

      // Fetch all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        throw rolesError;
      }

      // Merge users with their roles
      const usersWithRoles: UserWithRoles[] = (usersData as PmsUser[]).map((user) => {
        const userRoles = (rolesData as UserRole[])
          .filter((r) => r.user_id === user.id)
          .map((r) => r.role);
        
        return {
          ...user,
          roles: userRoles,
        };
      });

      return usersWithRoles;
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
  };
};
