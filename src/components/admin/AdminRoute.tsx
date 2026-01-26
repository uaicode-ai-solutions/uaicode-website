import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserRoles } from "@/hooks/useUserRoles";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { isAdmin, isLoadingRoles } = useUserRoles();

  // Show loading while checking auth or roles
  if (authLoading || isLoadingRoles) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/planningmysaas/login" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/planningmysaas/reports" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
