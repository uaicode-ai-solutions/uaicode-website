import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, Shield, Sparkles } from "lucide-react";

interface StepLoginProps {
  data: {
    email: string;
    password: string;
  };
  onChange: (field: string, value: string) => void;
  onGoogleLogin: () => void;
  onEmailLogin: () => void;
}

const StepLogin = ({ data, onChange, onGoogleLogin, onEmailLogin }: StepLoginProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isValidPassword = data.password && data.password.length >= 6;
  const canSubmit = isValidEmail && isValidPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onEmailLogin();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 mb-2">
          <Lock className="w-8 h-8 text-background" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Sign in to continue
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Access your personalized SaaS validation report and launch plan
        </p>
      </div>

      {/* Login Form Card */}
      <div className="max-w-md mx-auto">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={data.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="pl-10 bg-background border-border/50 focus:border-accent"
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
                  value={data.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  className="pl-10 pr-10 bg-background border-border/50 focus:border-accent"
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
              {data.password && data.password.length < 6 && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-accent hover:bg-accent/90 text-background font-semibold h-11"
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Email
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card/50 px-3 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleLogin}
            className="w-full h-11 border-border/50 hover:bg-muted/50"
          >
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
            Continue with Google
          </Button>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-accent hover:underline font-medium"
              onClick={() => {
                // For now, just proceed - full auth will be implemented later
              }}
            >
              Sign up
            </button>
          </p>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-accent" />
          <span>Your data is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default StepLogin;
