import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHeroAuth } from "@/hooks/useHeroAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import HeroHeader from "@/components/hero/HeroHeader";
import uaicodeLogo from "@/assets/uaicode-logo.png";

const HeroProfile = () => {
  const navigate = useNavigate();
  const { heroUser, loading } = useHeroAuth();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isFirstTime = !heroUser?.full_name?.trim();

  useEffect(() => {
    if (heroUser) {
      setFullName(heroUser.full_name || "");
      setAvatarUrl(heroUser.avatar_url);
    }
  }, [heroUser]);

  const initials = fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !heroUser) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `hero/${heroUser.auth_user_id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const newUrl = `${publicUrl}?t=${Date.now()}`;

      const { error: dbError } = await supabase
        .from("tb_hero_users" as any)
        .update({ avatar_url: newUrl } as any)
        .eq("id", heroUser.id);

      if (dbError) throw dbError;

      setAvatarUrl(newUrl);
      toast.success("Avatar updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroUser || !fullName.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("tb_hero_users" as any)
        .update({ full_name: fullName.trim() } as any)
        .eq("id", heroUser.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");

      if (isFirstTime) {
        navigate("/hero/home");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-uai-500/30 border-t-uai-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {!isFirstTime && <HeroHeader />}

      <div className="flex items-center justify-center p-6 pt-16">
        <div className="w-full max-w-md space-y-8">
          {isFirstTime && (
            <div className="flex items-center justify-center gap-3">
              <img src={uaicodeLogo} alt="Uaicode" className="h-8 w-auto" />
              <span className="text-lg font-bold text-white">
                Hero<span className="text-uai-500">Ecosystem</span>
              </span>
            </div>
          )}

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-uai-500/10 border border-uai-500/20 mb-2">
              <User className="w-7 h-7 text-uai-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isFirstTime ? "Complete Your Profile" : "Edit Profile"}
            </h1>
            <p className="text-white/50 text-sm">
              {isFirstTime
                ? "Welcome! Please fill in your name to get started."
                : "Update your profile information."}
            </p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-white/10">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-uai-500/20 text-uai-500 text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            <p className="text-white/30 text-xs">Click to change avatar</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/80">Email</Label>
              <Input
                id="email"
                value={heroUser?.email || ""}
                disabled
                className="h-12 bg-white/[0.02] border-white/[0.06] text-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full-name" className="text-sm font-medium text-white/80">
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="full-name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-uai-500/50"
                required
                autoFocus={isFirstTime}
              />
            </div>

            <Button
              type="submit"
              disabled={!fullName.trim() || isSaving}
              className="w-full h-12 bg-uai-500 hover:bg-uai-600 text-black font-semibold"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving..." : isFirstTime ? "Complete Setup" : "Save Changes"}
            </Button>
          </form>

          {!isFirstTime && (
            <Button
              variant="ghost"
              onClick={() => navigate("/hero/home")}
              className="w-full text-white/50 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;
