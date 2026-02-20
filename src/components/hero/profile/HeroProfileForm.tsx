import { useState, useEffect } from "react";
import { useHeroAuth } from "@/hooks/useHeroAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Save, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const HeroProfileForm = () => {
  const { heroUser, isHeroAdmin, loading } = useHeroAuth();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isNewUser = !heroUser?.full_name;

  useEffect(() => {
    if (heroUser) {
      setFullName(heroUser.full_name || "");
      setAvatarUrl(heroUser.avatar_url || "");
    }
  }, [heroUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !heroUser) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("tb_hero_users" as any)
        .update({
          full_name: fullName.trim(),
          avatar_url: avatarUrl.trim() || null,
        } as any)
        .eq("id", heroUser.id);

      if (error) throw error;
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      {isNewUser && (
        <div className="rounded-xl border border-uai-500/20 bg-uai-500/5 p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-uai-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-white font-semibold">Welcome to Hero Ecosystem!</h3>
            <p className="text-white/50 text-sm mt-1">Please complete your profile to get started.</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-white">My Profile</h2>
        <p className="text-sm text-white/40 mt-1">Manage your personal information</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white/70">Full Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-uai-500/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Email</Label>
          <Input
            value={heroUser?.email || ""}
            readOnly
            className="bg-white/[0.02] border-white/[0.06] text-white/40 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Team</Label>
          <Input
            value={heroUser?.team || ""}
            readOnly
            className="bg-white/[0.02] border-white/[0.06] text-white/40 cursor-not-allowed capitalize"
          />
          {!isHeroAdmin && (
            <p className="text-xs text-white/30">Contact an admin to change your team</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Avatar URL</Label>
          <Input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 focus:border-uai-500/50"
          />
        </div>

        <Button
          type="submit"
          disabled={!fullName.trim() || isSaving}
          className="bg-uai-500 hover:bg-uai-600 text-black font-semibold gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
};

export default HeroProfileForm;
