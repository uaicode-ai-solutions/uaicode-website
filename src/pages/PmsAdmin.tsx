import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Search,
  Loader2,
  Check,
  X,
  Crown,
  UserCheck,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAdminUsers, UserWithRoles } from "@/hooks/useAdminUsers";
import { useUserRoles, AppRole } from "@/hooks/useUserRoles";
import { useAuthContext } from "@/contexts/AuthContext";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import { toast } from "sonner";

const ROLE_CONFIG: Record<AppRole, { label: string; icon: React.ElementType; color: string }> = {
  admin: { label: "Admin", icon: Crown, color: "text-amber-500" },
  contributor: { label: "Contributor", icon: UserCheck, color: "text-blue-500" },
  user: { label: "User", icon: UserIcon, color: "text-muted-foreground" },
};

const PmsAdmin = () => {
  const navigate = useNavigate();
  const { pmsUser } = useAuthContext();
  const { users, isLoading, refetch } = useAdminUsers();
  const { addRole, removeRole, isAddingRole, isRemovingRole } = useUserRoles();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleToggleRole = async (user: UserWithRoles, role: AppRole) => {
    const toggleKey = `${user.id}-${role}`;
    setPendingToggle(toggleKey);

    try {
      const hasRole = user.roles.includes(role);
      
      // Prevent removing the last admin
      if (role === "admin" && hasRole) {
        const adminCount = users.filter(u => u.roles.includes("admin")).length;
        if (adminCount <= 1) {
          toast.error("Cannot remove the last admin");
          return;
        }
      }

      if (hasRole) {
        await removeRole({ userId: user.id, role });
        toast.success(`Removed ${role} role from ${user.full_name}`);
      } else {
        await addRole({ userId: user.id, role });
        toast.success(`Added ${role} role to ${user.full_name}`);
      }
      
      refetch();
    } catch (error) {
      console.error("Error toggling role:", error);
      toast.error("Failed to update role");
    } finally {
      setPendingToggle(null);
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "default";
      case "contributor":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 aurora-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />

      {/* Header Premium */}
      <header className="sticky top-0 z-50 glass-premium border-b border-accent/10">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Back button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/planningmysaas/reports")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {/* Center - Logo */}
            <div className="flex items-center gap-3">
              <img 
                src={uaicodeLogo} 
                alt="Uaicode" 
                className="h-9 w-9 rounded-lg"
              />
              <div>
                <span className="text-lg font-bold text-foreground">
                  Planning<span className="text-accent">My</span>SaaS
                </span>
              </div>
            </div>

            {/* Right - Admin Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1 bg-accent/20 text-accent border-accent/30">
                <Shield className="h-3 w-3" />
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative max-w-6xl mx-auto px-4 lg:px-8 py-8">
        {/* Hero */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Admin Panel
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage users and their access roles
          </p>
        </section>

        {/* Users Management Card */}
        <Card className="glass-card border-accent/10">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-accent" />
                <div>
                  <CardTitle className="text-lg">Manage Users & Roles</CardTitle>
                  <CardDescription>
                    {users.length} users registered
                  </CardDescription>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background/50 border-border/50"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? "No users found matching your search" : "No users found"}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-background/30 border border-border/30 hover:border-accent/20 transition-colors"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-semibold text-sm">
                          {user.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {user.full_name}
                          {user.id === pmsUser?.id && (
                            <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Current Roles Display */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => {
                          const config = ROLE_CONFIG[role];
                          const Icon = config.icon;
                          return (
                            <Badge 
                              key={role} 
                              variant={getRoleBadgeVariant(role)}
                              className="gap-1"
                            >
                              <Icon className={`h-3 w-3 ${config.color}`} />
                              {config.label}
                            </Badge>
                          );
                        })
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          No roles
                        </Badge>
                      )}
                    </div>

                    {/* Role Toggles */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      {(["admin", "contributor", "user"] as AppRole[]).map((role) => {
                        const config = ROLE_CONFIG[role];
                        const Icon = config.icon;
                        const hasRole = user.roles.includes(role);
                        const isPending = pendingToggle === `${user.id}-${role}`;
                        
                        return (
                          <div key={role} className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${config.color}`} />
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {config.label}
                            </span>
                            {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin text-accent" />
                            ) : (
                              <Switch
                                checked={hasRole}
                                onCheckedChange={() => handleToggleRole(user, role)}
                                disabled={isAddingRole || isRemovingRole}
                                className="data-[state=checked]:bg-accent"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PmsAdmin;
