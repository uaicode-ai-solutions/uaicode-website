import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// URL de produção para redirects de autenticação
const APP_URL = "https://uaicode.ai";

interface PmsUser {
  id: string;
  auth_user_id: string;
  email: string;
  username?: string;
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
    // Track if welcome email was already sent in this session to avoid duplicates
    const sentWelcomeEmails = new Set<string>();

    // Helper function to send welcome email for new users
    const sendWelcomeEmailIfNew = async (user: User) => {
      // Avoid duplicate sends in the same session
      if (sentWelcomeEmails.has(user.id)) return;
      
      const createdAt = new Date(user.created_at);
      const now = new Date();
      const isNewUser = (now.getTime() - createdAt.getTime()) < 5 * 60 * 1000; // 5 minutes
      
      if (isNewUser) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
        if (fullName && user.email) {
          sentWelcomeEmails.add(user.id);
          try {
            await supabase.functions.invoke('pms-send-welcome-email', {
              body: { email: user.email, fullName }
            });
            console.log('Welcome email sent successfully to:', user.email);
          } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't block auth flow if email fails
          }
        }
      }
    };

    // Set up auth state listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        if (user) {
          // Use setTimeout to avoid potential deadlock with Supabase client
          setTimeout(async () => {
            // Fetch PMS user profile (created automatically by database trigger)
            const pmsUser = await fetchPmsUserData(user.id);
            
            // Send welcome email for new users on SIGNED_IN event
            if (event === 'SIGNED_IN') {
              await sendWelcomeEmailIfNew(user);
            }
            
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
        emailRedirectTo: `${APP_URL}/planningmysaas/login`,
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
    try {
      const { error } = await supabase.auth.signOut();
      // Ignore "session_not_found" errors - user is already logged out
      if (error && !error.message?.toLowerCase().includes("session") && error.status !== 403) {
        throw error;
      }
    } catch (err: any) {
      // If error is about missing session, ignore it - goal achieved
      if (err?.message?.toLowerCase().includes("session") || err?.status === 403) {
        console.log("Session already ended, proceeding with logout");
      } else {
        throw err;
      }
    }
    // Always ensure local cleanup
    await supabase.auth.signOut({ scope: "local" });
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${APP_URL}/planningmysaas/reports`,
      },
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${APP_URL}/planningmysaas/reset-password`,
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

    // Supabase constants (no VITE_* env vars)
    const SUPABASE_URL = "https://ccjnxselfgdoeyyuziwt.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg";

    // Get current session
    let { data: { session } } = await supabase.auth.getSession();
    
    // If no token, try refreshing
    if (!session?.access_token) {
      const { data: refreshData } = await supabase.auth.refreshSession();
      session = refreshData.session;
    }
    
    if (!session?.access_token) {
      throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    // Call edge function with direct fetch
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/pms-delete-account`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify({})
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Falha ao deletar conta' }));
      throw new Error(errorData.error || 'Falha ao deletar conta');
    }

    // Force local cleanup after successful deletion
    await supabase.auth.signOut({ scope: "local" });
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
