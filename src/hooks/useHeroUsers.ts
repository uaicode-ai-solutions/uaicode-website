import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export interface HeroUserWithRoles extends HeroUser {
  roles: string[];
}

export const useHeroUsers = () => {
  return useQuery({
    queryKey: ["hero-users"],
    queryFn: async () => {
      const { data: usersData, error: usersError } = await supabase
        .from("tb_hero_users" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      const { data: rolesData, error: rolesError } = await supabase
        .from("tb_hero_roles" as any)
        .select("*");

      if (rolesError) throw rolesError;

      const users = (usersData as any as HeroUser[]).map((user) => {
        const userRoles = (rolesData as any as HeroRole[])
          .filter((r) => r.user_id === user.id)
          .map((r) => r.role);
        return { ...user, roles: userRoles } as HeroUserWithRoles;
      });

      return users;
    },
  });
};
