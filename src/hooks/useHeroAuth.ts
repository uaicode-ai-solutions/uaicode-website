import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface HeroUser {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  team: string;
}

interface HeroRole {
  id: string;
  user_id: string;
  role: string;
}

export const useHeroAuth = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuthContext();
  const [heroUser, setHeroUser] = useState<HeroUser | null>(null);
  const [heroRoles, setHeroRoles] = useState<HeroRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setHeroUser(null);
      setHeroRoles([]);
      setLoading(false);
      setNotAuthorized(false);
      return;
    }

    const fetchHeroData = async () => {
      setLoading(true);

      // Fetch hero user profile
      const { data: heroData, error: heroError } = await supabase
        .from("tb_hero_users" as any)
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      if (heroError || !heroData) {
        setHeroUser(null);
        setHeroRoles([]);
        setNotAuthorized(true);
        setLoading(false);
        return;
      }

      const typedHeroData = heroData as any as HeroUser;
      setHeroUser(typedHeroData);
      setNotAuthorized(false);

      // Fetch hero roles
      const { data: rolesData } = await supabase
        .from("tb_hero_roles" as any)
        .select("*")
        .eq("user_id", typedHeroData.id);

      setHeroRoles((rolesData as any as HeroRole[]) || []);
      setLoading(false);
    };

    fetchHeroData();
  }, [user, authLoading]);

  const isHeroAdmin = heroRoles.some((r) => r.role === "admin");
  const isContributor = heroRoles.some((r) => r.role === "contributor");
  const heroTeam = heroUser?.team || "none";

  const canAccessSubsystem = useCallback(
    (subsystem: string) => {
      if (isHeroAdmin) return true;
      if (heroTeam === subsystem) return true;
      return false;
    },
    [isHeroAdmin, heroTeam]
  );

  return {
    heroUser,
    heroRoles,
    isHeroAdmin,
    isContributor,
    heroTeam,
    canAccessSubsystem,
    loading: authLoading || loading,
    isAuthenticated,
    notAuthorized,
  };
};
