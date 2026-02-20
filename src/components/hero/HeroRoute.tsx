import { Navigate, useLocation } from "react-router-dom";
import { useHeroAuth } from "@/hooks/useHeroAuth";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";

interface HeroRouteProps {
  children: React.ReactNode;
}

const HeroRoute = ({ children }: HeroRouteProps) => {
  const { loading, isAuthenticated, notAuthorized } = useHeroAuth();
  const { signOut } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-uai-500/30 border-t-uai-500 rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading Hero Ecosystem...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/hero" state={{ from: location }} replace />;
  }

  if (notAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-white/60">
            You don't have access to the Hero Ecosystem. Contact your administrator to get access.
          </p>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default HeroRoute;
