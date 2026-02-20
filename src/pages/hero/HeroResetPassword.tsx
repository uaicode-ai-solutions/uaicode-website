import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Shield } from "lucide-react";
import { PasswordStrengthIndicator, calculatePasswordStrength } from "@/components/ui/password-strength-indicator";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import uaicodeLogo from "@/assets/uaicode-logo.png";

type PageState = "loading" | "form" | "success" | "error";

const HeroResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword } = useAuthContext();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const passwordStrength = calculatePasswordStrength(password);
  const isValidPassword = passwordStrength.score >= 3;
  const passwordsMatch = password === confirmPassword;
  const canSubmit = isValidPassword && passwordsMatch && confirmPassword.length > 0;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setPageState("form");
        } else if (event === "SIGNED_IN" && session) {
          setPageState("form");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setPageState("form");
      } else {
        setTimeout(() => {
          setPageState((prev) => (prev === "loading" ? "error" : prev));
        }, 3000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (!passwordsMatch) {
      setErrorMsg("Passwords do not match");
      return;
    }
    if (!isValidPassword) {
      setErrorMsg("Password must be at least Medium strength");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await updatePassword(password);
      setPageState("success");
      toast.success("Password updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <img src={uaicodeLogo} alt="Uaicode" className="h-8 w-auto" />
          <span className="text-lg font-bold text-white">
            Hero<span className="text-uai-500">Ecosystem</span>
          </span>
        </div>

        {pageState === "loading" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="h-8 w-8 border-4 border-uai-500/30 border-t-uai-500 rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Verifying reset link...</p>
          </div>
        )}

        {pageState === "error" && (
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Invalid or Expired Link</h1>
            <p className="text-white/50 text-sm">This password reset link is no longer valid. Please request a new one.</p>
            <Button onClick={() => navigate("/hero")} className="bg-uai-500 hover:bg-uai-600 text-black font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        )}

        {pageState === "form" && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-uai-500/10 border border-uai-500/20 mb-2">
                <Lock className="w-7 h-7 text-uai-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">Set New Password</h1>
              <p className="text-white/50 text-sm">Choose a strong password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-white/80">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-uai-500/50"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrengthIndicator password={password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-white/80">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-uai-500/50"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-400 text-xs">Passwords do not match.</p>
                )}
                {confirmPassword && passwordsMatch && password.length >= 6 && (
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Passwords match
                  </p>
                )}
              </div>

              <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full h-12 bg-uai-500 hover:bg-uai-600 text-black font-semibold">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </form>

            <div className="flex items-center justify-center gap-2 text-sm text-white/30 pt-2">
              <Shield className="w-4 h-4 text-uai-500/50" />
              <span>Your data is secure and encrypted</span>
            </div>
          </div>
        )}

        {pageState === "success" && (
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <h1 className="text-xl font-bold text-white">Password Updated!</h1>
            <p className="text-white/50 text-sm">Your password has been changed successfully.</p>
            <Button onClick={() => navigate("/hero/dash?view=profile")} className="bg-uai-500 hover:bg-uai-600 text-black font-semibold">
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroResetPassword;
