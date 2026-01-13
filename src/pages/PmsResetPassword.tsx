import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Shield, ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import pmsDashboardImage from "@/assets/pms-hero-dashboard.webp";

const PmsResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuthContext();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidSession, setIsValidSession] = useState(false);
  const [loading, setLoading] = useState(true);

  const isValidPassword = password.length >= 6;
  const passwordsMatch = password === confirmPassword;
  const canSubmit = isValidPassword && passwordsMatch && confirmPassword.length > 0;

  // Check for password recovery session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsValidSession(true);
          setLoading(false);
        } else if (event === "SIGNED_IN" && session) {
          // User might already have a valid session from the recovery link
          setIsValidSession(true);
          setLoading(false);
        }
      }
    );

    // Check if there's already a valid session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (!isValidPassword) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updatePassword(password);
      setSuccess(true);
      toast.success("Password updated successfully!");
    } catch (err: any) {
      console.error("Password update error:", err);
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Invalid or expired token state
  if (!isValidSession && !loading) {
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
          
          <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12">
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
            
            <p className="hidden lg:block text-sm text-muted-foreground">
              © 2025 Uaicode. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right side - Error state */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
          <div className="w-full max-w-md space-y-8 animate-fade-in text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 mb-2">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Link Expired or Invalid
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              This password reset link has expired or is invalid. Please request a new one.
            </p>
            <div className="space-y-4 pt-4">
              <Button
                onClick={() => navigate("/planningmysaas/login")}
                className="w-full bg-accent hover:bg-accent/90 text-background font-semibold h-12"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
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
          
          <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12">
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
            
            <p className="hidden lg:block text-sm text-muted-foreground">
              © 2025 Uaicode. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right side - Success state */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
          <div className="w-full max-w-md space-y-8 animate-fade-in text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-2">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Password Updated!
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Your password has been successfully updated. You can now access your account with your new password.
            </p>
            <div className="space-y-4 pt-4">
              <Button
                onClick={() => navigate("/planningmysaas/reports")}
                className="w-full bg-accent hover:bg-accent/90 text-background font-semibold h-12"
              >
                Go to Dashboard
              </Button>
            </div>
            
            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
              <Shield className="w-4 h-4 text-accent" />
              <span>Your data is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main form state
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
              onClick={() => navigate("/planningmysaas/login")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          {/* Inspirational text - hidden on mobile, visible on desktop */}
          <div className="hidden lg:block space-y-4 max-w-lg">
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground leading-tight">
              Secure Your Account
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose a strong password to protect your SaaS validation reports and insights.
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
              Create New Password
            </h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Enter your new password below. Make sure it's at least 6 characters.
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                New Password
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
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && password.length < 6 && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-muted/30 border-border/50 focus:border-accent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive">
                  Passwords do not match
                </p>
              )}
              {confirmPassword && passwordsMatch && password.length >= 6 && (
                <p className="text-xs text-accent flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-accent hover:bg-accent/90 text-background font-semibold h-12"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </form>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
            <Shield className="w-4 h-4 text-accent" />
            <span>Your data is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PmsResetPassword;
