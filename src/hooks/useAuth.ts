import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface PmsUser {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  linkedin_profile?: string;
  user_role?: string;
  user_role_other?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  pmsUser: PmsUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

// Helper function to fetch PMS user (outside hook)
const fetchPmsUserData = async (userId: string): Promise<PmsUser | null> => {
  const { data, error } = await supabase
    .from("tb_pms_users")
    .select("*")
    .eq("auth_user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching PMS user:", error);
    return null;
  }

  return data as PmsUser;
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    pmsUser: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Set up auth state listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        if (user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(async () => {
            // Fetch PMS user profile (created automatically by database trigger)
            const pmsUser = await fetchPmsUserData(user.id);
            
            setAuthState({
              user,
              session,
              pmsUser,
              loading: false,
              isAuthenticated: true,
            });
          }, 0);
        } else {
          setAuthState({
            user: null,
            session: null,
            pmsUser: null,
            loading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      
      let pmsUser: PmsUser | null = null;
      if (user) {
        pmsUser = await fetchPmsUserData(user.id);
      }

      setAuthState({
        user,
        session,
        pmsUser,
        loading: false,
        isAuthenticated: !!user,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Create auth user - profile is created automatically by database trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName, // Trigger will use this value
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("User creation failed");

    return authData;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/planningmysaas/reports`,
      },
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/planningmysaas/reset-password`,
    });

    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Pick<PmsUser, "full_name" | "phone" | "linkedin_profile">>) => {
    if (!authState.user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("tb_pms_users")
      .update(updates)
      .eq("auth_user_id", authState.user.id);

    if (error) throw error;

    // Refresh pmsUser data
    const pmsUser = await fetchPmsUserData(authState.user.id);
    setAuthState(prev => ({ ...prev, pmsUser }));
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    // Send password changed confirmation email
    if (authState.pmsUser) {
      try {
        await supabase.functions.invoke('pms-send-password-changed', {
          body: { 
            email: authState.pmsUser.email, 
            fullName: authState.pmsUser.full_name 
          }
        });
      } catch (emailError) {
        console.error("Failed to send password changed email:", emailError);
        // Don't block if email fails
      }
    }
  };

  const updateEmail = async (newEmail: string) => {
    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) throw error;

    // Also update in tb_pms_users
    if (authState.user) {
      await supabase
        .from("tb_pms_users")
        .update({ email: newEmail })
        .eq("auth_user_id", authState.user.id);
    }
  };

  const deleteAccount = async () => {
    if (!authState.user) throw new Error("Not authenticated");

    // Call edge function to delete all user data
    const { error } = await supabase.functions.invoke('pms-delete-account');

    if (error) throw error;

    // Clear local auth state
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updateProfile,
    updatePassword,
    updateEmail,
    deleteAccount,
    refreshPmsUser: () => authState.user ? fetchPmsUserData(authState.user.id) : null,
  };
};
