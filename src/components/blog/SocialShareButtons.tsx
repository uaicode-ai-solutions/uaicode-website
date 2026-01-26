import { Share2, Linkedin, Twitter, Facebook, MessageCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareButtonsProps {
  orientation?: "vertical" | "horizontal";
  label?: string;
}

export const SocialShareButtons = ({ orientation = "vertical", label }: SocialShareButtonsProps) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = typeof document !== 'undefined' ? document.title : '';

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);

    const shareUrls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      console.log("Link copied to clipboard");
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const buttons = [
    { icon: Linkedin, platform: 'linkedin', label: 'LinkedIn' },
    { icon: Twitter, platform: 'twitter', label: 'Twitter' },
    { icon: Facebook, platform: 'facebook', label: 'Facebook' },
    { icon: MessageCircle, platform: 'whatsapp', label: 'WhatsApp' },
    { icon: Copy, platform: 'copy', label: 'Copy Link' },
  ];

  return (
    <div className={orientation === "vertical" ? "flex flex-col gap-4" : "flex flex-wrap gap-4 items-center justify-center"}>
      {label && (
        <span className="text-base font-semibold text-foreground mb-2">{label}</span>
      )}
      {buttons.map(({ icon: Icon, platform, label: btnLabel }) => (
        <Button
          key={platform}
          variant="ghost"
          size="icon"
          onClick={() => handleShare(platform)}
          className="h-10 w-10 rounded-full border border-accent/30 bg-background hover:bg-accent hover:border-accent hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 transition-all duration-300 group"
          aria-label={btnLabel}
        >
          <Icon className="h-4 w-4 text-accent group-hover:text-background" />
        </Button>
      ))}
    </div>
  );
};
