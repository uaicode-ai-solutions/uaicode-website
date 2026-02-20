import { Share2 } from "lucide-react";

const SocialMediaOverview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Social Media</h2>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
          <Share2 className="w-6 h-6 text-white/20" />
        </div>
        <p className="text-sm text-white/40">Coming soon</p>
        <p className="text-xs text-white/20">Social media management will be available here</p>
      </div>
    </div>
  );
};

export default SocialMediaOverview;
