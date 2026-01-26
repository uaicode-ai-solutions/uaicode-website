import { useState, useEffect } from "react";
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
  Sparkles,
  Loader2,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import uaicodeLogo from "@/assets/uaicode-logo.png";

const PmsProfile = () => {
  const navigate = useNavigate();
  const { pmsUser, updateProfile, updatePassword, updateEmail, deleteAccount } = useAuthContext();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  // Delete account states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Load user data
  useEffect(() => {
    if (pmsUser) {
      setName(pmsUser.full_name || "");
      setEmail(pmsUser.email || "");
    }
  }, [pmsUser]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    
    try {
      // Update name in tb_pln_users
      await updateProfile({ full_name: name });
      
      // Update email if changed
      if (email !== pmsUser?.email) {
        await updateEmail(email);
        console.log("Email update requested - check new email for confirmation");
      } else {
        console.log("Profile updated successfully");
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      console.error("Password too short");
      return;
    }
    
    setIsSavingPassword(true);
    
    try {
      await updatePassword(newPassword);
      console.log("Password updated successfully");
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password update error:", error);
    } finally {
      setIsSavingPassword(false);
    }
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {isSavingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="glass-card border-destructive/20 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible account actions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground font-medium">Delete your account permanently</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This will delete all your data, reports, and payment history. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={(open) => !isDeleting && setIsDeleteDialogOpen(open)}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent 
                  className="glass-premium border-destructive/20"
                  onEscapeKeyDown={(e) => isDeleting && e.preventDefault()}
                >
                  <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      </div>
                      <AlertDialogTitle className="text-xl">Delete Account</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-muted-foreground">
                      This action is <strong className="text-destructive">permanent and irreversible</strong>. 
                      All your data will be deleted, including:
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <div className="py-4 space-y-3">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-destructive">✕</span> Your profile information
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-destructive">✕</span> All SaaS validation reports
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-destructive">✕</span> Payment history and receipts
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-destructive">✕</span> Any saved preferences
                      </li>
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <Label htmlFor="deleteConfirm" className="text-sm font-medium">
                        Type <span className="text-destructive font-bold">DELETE</span> to confirm:
                      </Label>
                      <Input
                        id="deleteConfirm"
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE"
                        disabled={isDeleting}
                        className="bg-background/50 border-destructive/30 focus:border-destructive/50"
                      />
                    </div>
                    
                    {isDeleting && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                        <span>Deleting your account... please wait.</span>
                      </div>
                    )}
                  </div>
                  
                  <AlertDialogFooter>
                    <AlertDialogCancel 
                      onClick={() => setDeleteConfirmText("")}
                      disabled={isDeleting}
                      className="border-border/50"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      variant="destructive"
                      disabled={deleteConfirmText !== "DELETE" || isDeleting}
                      onClick={async () => {
                        setIsDeleting(true);
                        try {
                          await deleteAccount();
                          console.log("Account deleted successfully");
                          // Force full page reload to clear all state and ensure navigation
                          window.location.replace("/planningmysaas/login");
                        } catch (error: any) {
                          console.error("Delete account error:", error);
                          // Only reset state on error - success will reload the page
                          setIsDeleting(false);
                          setIsDeleteDialogOpen(false);
                          setDeleteConfirmText("");
                        }
                      }}
                      className="gap-2"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {isDeleting ? "Deleting..." : "Delete Account Forever"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PmsProfile;
