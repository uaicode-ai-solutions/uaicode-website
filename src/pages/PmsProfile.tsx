import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Save,
  Shield,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import uaicodeLogo from "@/assets/uaicode-logo.png";

const PmsProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form states
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
    
    setIsSavingProfile(false);
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your new password and confirmation match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSavingPassword(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsSavingPassword(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 aurora-bg opacity-40 pointer-events-none" />
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />

      {/* Header Premium */}
      <header className="sticky top-0 z-50 glass-premium border-b border-accent/10">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back + Logo */}
            <div 
              onClick={() => navigate("/planningmysaas/reports")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/10 h-9 w-9 rounded-full border border-border/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <img 
                src={uaicodeLogo} 
                alt="Uaicode" 
                className="h-9 w-9 rounded-lg"
              />
              <span className="text-lg font-bold text-foreground hidden sm:block group-hover:text-accent transition-colors">
                Planning<span className="text-accent">My</span>SaaS
              </span>
            </div>

            {/* Page Title */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="h-4 w-4 text-accent" />
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">Profile Settings</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative max-w-4xl mx-auto px-4 lg:px-8 py-8 animate-smooth-fade">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">Account Settings</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Your Profile
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your account information and security settings
          </p>
        </div>

        <div className="grid gap-6 max-w-2xl mx-auto">
          {/* Profile Information Card */}
          <Card className="glass-premium border-accent/10 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Save Profile Button */}
              <Button 
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
                className="w-full gap-2 bg-accent hover:bg-accent/90 text-background font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all duration-300"
              >
                {isSavingProfile ? (
                  <div className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="glass-premium border-accent/10 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 transition-all"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 transition-all"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-accent/50 focus:ring-accent/20 transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Save Password Button */}
              <Button 
                onClick={handleSavePassword}
                disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
                variant="outline"
                className="w-full gap-2 border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
              >
                {isSavingPassword ? (
                  <div className="h-4 w-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {isSavingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone - Future enhancement */}
          <Card className="glass-card border-destructive/20 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible account actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300"
                onClick={() => {
                  toast({
                    title: "Coming soon",
                    description: "Account deletion will be available in a future update.",
                  });
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PmsProfile;
