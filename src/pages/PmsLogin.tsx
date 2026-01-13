import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { PasswordStrengthIndicator, calculatePasswordStrength } from "@/components/ui/password-strength-indicator";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import pmsDashboardImage from "@/assets/pms-hero-dashboard.webp";

const PmsLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, resetPassword, isAuthenticated, loading } = useAuthContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const isValidEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordStrength = calculatePasswordStrength(password);
  const isValidPassword = isLogin ? (password && password.length >= 6) : passwordStrength.score >= 3;
  const isValidName = fullName.trim().length >= 2;
  const canSubmit = isValidEmail && isValidPassword && (isLogin || isValidName);

  // Get the redirect destination
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/planningmysaas/reports";

  // Redirect if already authenticated
  if (!loading && isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success("Welcome back!");
      } else {
        const result = await signUp(email, password, fullName);
        
        // Check if email confirmation is required
        if (result.user && !result.session) {
          // Email confirmation is enabled - user needs to confirm email first
          toast.success("Account created! Please check your email to confirm your account before signing in.", {
            duration: 6000,
          });
          setIsLogin(true);
          setPassword("");
          return; // Don't navigate, user needs to confirm email first
        }
        
        // Send welcome email
        try {
          await supabase.functions.invoke('pms-send-welcome-email', {
            body: { email, fullName }
          });
        } catch (emailError) {
          console.error("Failed to send welcome email:", emailError);
          // Don't block signup if email fails
        }
        
        toast.success("Account created successfully! Check your email for a welcome message.");
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle specific error messages
      if (error.message?.includes("Invalid login credentials")) {
        toast.error("Invalid email or password");
      } else if (error.message?.includes("User already registered")) {
        toast.error("This email is already registered. Please sign in.");
        setIsLogin(true);
      } else if (error.message?.includes("Email not confirmed")) {
        toast.error("Please check your email to confirm your account");
      } else {
        toast.error(error.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      // Redirect is handled automatically by Supabase OAuth
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast.error(error.message || "Failed to sign in with Google");
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image with overlay */}
      <div className="relative w-full lg:w-1/2 h-56 sm:h-72 lg:h-auto lg:min-h-screen">
        <img
          src={pmsDashboardImage}
          alt="PlanningMySaaS Dashboard"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-accent/30" />
        
        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12">
          {/* Logo and back button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src={uaicodeLogo} 
                alt="Uaicode" 
                className="h-8 sm:h-10 w-auto"
              />
              <span className="text-lg sm:text-xl font-bold text-foreground">
                Planning<span className="text-accent">My</span>SaaS
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/planningmysaas")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          {/* Inspirational text - hidden on mobile, visible on desktop */}
          <div className="hidden lg:block space-y-4 max-w-lg">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground leading-tight">
              Transform Your SaaS Idea Into Reality
            </h2>
            <p className="text-lg text-muted-foreground">
              Get a complete validation report and launch roadmap powered by AI in just minutes. 
              Stop guessing, start building with confidence.
            </p>
          </div>
          
          {/* Footer - hidden on mobile */}
          <p className="hidden lg:block text-sm text-muted-foreground">
            © 2025 Uaicode. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* CTA Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/60 mb-2">
              <Lock className="w-7 h-7 text-background" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {isLogin ? "Welcome" : "Start Your Journey"}
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {isLogin
                ? "Sign in to create your personalized SaaS validation report"
                : "Create an account to validate your SaaS idea with AI"}
            </p>
          </div>

          {/* Login Form Card */}
          <div className="space-y-6">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Full Name - Only show on signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 bg-muted/30 border-border/50 focus:border-accent"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-accent"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-muted/30 border-border/50 focus:border-accent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator - Only show on signup */}
                {!isLogin && <PasswordStrengthIndicator password={password} />}
              </div>

              {/* Forgot Password Link - Only show on login */}
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-background font-semibold h-12"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {isSubmitting 
                  ? (isLogin ? "Signing in..." : "Creating account...") 
                  : (isLogin ? "Sign In" : "Create Account")
                }
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full h-12 border-border/50 hover:bg-muted/50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            {/* Sign up link */}
            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-accent hover:underline font-medium"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFullName("");
                }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
            <Shield className="w-4 h-4 text-accent" />
            <span>Your data is secure and encrypted</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={(open) => {
        setShowForgotPassword(open);
        if (!open) setResetSuccess(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          {resetSuccess ? (
            <div className="text-center py-4 space-y-4">
              <CheckCircle className="w-12 h-12 text-accent mx-auto" />
              <p className="text-foreground">
                Check your email for a password reset link.
              </p>
              <Button onClick={() => {
                setShowForgotPassword(false);
                setResetSuccess(false);
              }}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={resetLoading}
              >
                {resetLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PmsLogin;
