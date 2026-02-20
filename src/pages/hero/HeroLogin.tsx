import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, Shield, Loader2, AlertCircle, CheckCircle2, UserX } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthContext } from "@/contexts/AuthContext";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import heroLoginBg from "@/assets/hero-login-bg.webp";

const HeroLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, resetPassword, isAuthenticated, loading } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/hero/home";

  if (!loading && isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const canSubmit = email && password.length >= 6;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error: any) {
      setErrorMsg(error.message?.includes("Invalid login") 
        ? "Invalid email or password. Please try again." 
        : error.message || "Login failed.");
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-uai-500/30 border-t-uai-500 rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black">
      {/* Left - Visual */}
      <div className="relative w-full lg:w-1/2 h-56 sm:h-72 lg:h-auto lg:min-h-screen overflow-hidden">
        <img src={heroLoginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/10" />

        <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-8 lg:p-12">
          <div className="flex items-center gap-3">
            <img src={uaicodeLogo} alt="Uaicode" className="h-8 sm:h-10 w-auto" />
            <span className="text-lg sm:text-xl font-bold text-white">
              Hero<span className="text-uai-500">Ecosystem</span>
            </span>
          </div>

          <div className="hidden lg:block space-y-4 max-w-lg">
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
              Welcome to the <span className="text-uai-500">Hero Ecosystem</span>
            </h2>
            <p className="text-lg text-white/50">
              Internal corporate portal for Uaicode team members. Access your tools, dashboards, and resources.
            </p>
          </div>

          <p className="hidden lg:block text-sm text-white/30">
            © {new Date().getFullYear()} Uaicode. Internal use only.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-uai-500/10 border border-uai-500/20 mb-2">
              <Lock className="w-7 h-7 text-uai-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Sign In</h1>
            <p className="text-white/50 max-w-sm mx-auto">
              Access restricted to authorized team members only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/80">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@uaicode.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-uai-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white/80">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-uai-500/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => { setShowForgotPassword(true); setForgotEmail(email); setForgotSuccess(false); setForgotError(""); }}
                className="text-sm text-uai-500/70 hover:text-uai-500 transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full h-12 bg-uai-500 hover:bg-uai-600 text-black font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-sm text-white/30 pt-4">
            <Shield className="w-4 h-4 text-uai-500/50" />
            <span>Authorized personnel only</span>
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Login Error
            </DialogTitle>
            <DialogDescription className="text-white/60">{errorMsg}</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowError(false)} className="bg-uai-500 hover:bg-uai-600 text-black">
            Try Again
          </Button>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={(open) => { setShowForgotPassword(open); if (!open) { setForgotSuccess(false); setForgotError(""); } }}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-uai-500" />
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Enter your email and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>

          {forgotSuccess ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-uai-500/10 border border-uai-500/20">
                <CheckCircle2 className="w-8 h-8 text-uai-500" />
              </div>
              <p className="text-white/90 text-center text-sm font-medium">
                Reset link sent!
              </p>
              <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <UserX className="w-4 h-4 text-uai-500 mt-0.5 shrink-0" />
                  <p className="text-white/60 text-xs leading-relaxed">
                    If you don't receive an email within a few minutes, your account may not exist in the system. Please contact the system administrator.
                  </p>
                </div>
                <a
                  href="mailto:admin@uaicode.ai"
                  className="flex items-center gap-2 text-uai-500 hover:text-uai-600 text-xs font-medium transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  admin@uaicode.ai
                </a>
              </div>
              <Button onClick={() => setShowForgotPassword(false)} className="bg-uai-500 hover:bg-uai-600 text-black mt-1 w-full">
                Got it
              </Button>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!forgotEmail) return;
              setForgotLoading(true);
              setForgotError("");
              try {
                await resetPassword(forgotEmail, `https://uaicode.ai/hero/reset-password`);
                setForgotSuccess(true);
              } catch (err: any) {
                setForgotError(err.message || "Failed to send reset email.");
              } finally {
                setForgotLoading(false);
              }
            }} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  type="email"
                  placeholder="you@uaicode.ai"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-uai-500/50"
                  required
                />
              </div>
              {forgotError && <p className="text-red-400 text-sm">{forgotError}</p>}
              <Button type="submit" disabled={!forgotEmail || forgotLoading} className="w-full bg-uai-500 hover:bg-uai-600 text-black font-semibold">
                {forgotLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroLogin;
