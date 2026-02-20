import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Video, Layers, ChevronLeft, ChevronRight, Calendar, Share2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type MediaContent = Tables<"tb_media_content">;

interface Slide {
  image_url: string;
  slide_number: number;
}

const getPreviewUrl = (content: MediaContent): string | null => {
  if (content.content_type === "carousel" && content.slides_json) {
    const slides = content.slides_json as unknown as Slide[];
    return slides.length > 0 ? slides[0].image_url : null;
  }
  return content.asset_url;
};

const getSlides = (content: MediaContent): Slide[] => {
  if (content.content_type === "carousel" && content.slides_json) {
    return (content.slides_json as unknown as Slide[]).sort((a, b) => a.slide_number - b.slide_number);
  }
  return [];
};

const ContentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "carousel": return <Layers className="w-3 h-3" />;
    case "video": return <Video className="w-3 h-3" />;
    default: return <Image className="w-3 h-3" />;
  }
};

const statusColors: Record<string, string> = {
  ready: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  generating: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  draft: "bg-white/10 text-white/50 border-white/10",
};

const SocialMediaOverview = () => {
  const [selectedContent, setSelectedContent] = useState<MediaContent | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: contents, isLoading } = useQuery({
    queryKey: ["media-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_media_content")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as MediaContent[];
    },
  });

  const openDetail = (content: MediaContent) => {
    setSelectedContent(content);
    setCurrentSlide(0);
  };

  const slides = selectedContent ? getSlides(selectedContent) : [];
  const currentImageUrl = selectedContent
    ? selectedContent.content_type === "carousel" && slides.length > 0
      ? slides[currentSlide]?.image_url
      : selectedContent.asset_url
    : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Social Media</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <Skeleton className="aspect-square w-full bg-white/[0.04]" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-20 bg-white/[0.04]" />
                <Skeleton className="h-3 w-16 bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      ) : !contents || contents.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-sm text-white/40">No content yet</p>
          <p className="text-xs text-white/20">Media content will appear here once created</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {contents.map((content) => {
            const previewUrl = getPreviewUrl(content);
            return (
              <div
                key={content.id}
                onClick={() => openDetail(content)}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden cursor-pointer hover:border-white/[0.12] transition-colors group"
              >
                <div className="relative aspect-square bg-white/[0.02]">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={content.caption || "Media content"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ContentTypeIcon type={content.content_type} />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/20 text-white/70 bg-black/40 gap-1">
                        <ContentTypeIcon type={content.content_type} />
                        {content.content_type}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-white/20 text-white/70 bg-black/40">
                        {content.pillar}
                      </Badge>
                      <Badge className={`text-[10px] px-1.5 py-0 border ${statusColors[content.status] || statusColors.draft}`}>
                        {content.status}
                      </Badge>
                    </div>
                  </div>
                  {/* Slide count for carousel */}
                  {content.content_type === "carousel" && content.slides_json && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white/80 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {(content.slides_json as unknown as Slide[]).length}
                    </div>
                  )}
                </div>
                <div className="px-3 py-2 flex items-center gap-1.5 text-[11px] text-white/30">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(content.created_at), "MMM d, yyyy")}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedContent} onOpenChange={(open) => !open && setSelectedContent(null)}>
        <DialogContent className="bg-[#0a0a0a] border-white/[0.06] text-white max-w-2xl p-0 gap-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Media Detail</DialogTitle>
          </DialogHeader>

          {selectedContent && (
            <>
              {/* Image viewer */}
              <div className="relative aspect-square bg-black">
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt={selectedContent.caption || "Media"}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ContentTypeIcon type={selectedContent.content_type} />
                  </div>
                )}

                {/* Carousel nav */}
                {slides.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8 rounded-full"
                      onClick={(e) => { e.stopPropagation(); setCurrentSlide((p) => Math.max(0, p - 1)); }}
                      disabled={currentSlide === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white h-8 w-8 rounded-full"
                      onClick={(e) => { e.stopPropagation(); setCurrentSlide((p) => Math.min(slides.length - 1, p + 1)); }}
                      disabled={currentSlide === slides.length - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white/80 text-xs px-2.5 py-1 rounded-full">
                      {currentSlide + 1} / {slides.length}
                    </div>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="p-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/20 text-white/70 gap-1">
                    <ContentTypeIcon type={selectedContent.content_type} />
                    {selectedContent.content_type}
                  </Badge>
                  <Badge variant="outline" className="border-white/20 text-white/70">
                    {selectedContent.pillar}
                  </Badge>
                  <Badge className={`border ${statusColors[selectedContent.status] || statusColors.draft}`}>
                    {selectedContent.status}
                  </Badge>
                </div>

                {selectedContent.caption && (
                  <ScrollArea className="max-h-32">
                    <p className="text-sm text-white/60 whitespace-pre-wrap">{selectedContent.caption}</p>
                  </ScrollArea>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs text-white/40">
                  <div>
                    <span className="text-white/20">Created</span>
                    <p className="text-white/50">{format(new Date(selectedContent.created_at), "MMM d, yyyy HH:mm")}</p>
                  </div>
                  {selectedContent.scheduled_for && (
                    <div>
                      <span className="text-white/20">Scheduled</span>
                      <p className="text-white/50">{format(new Date(selectedContent.scheduled_for), "MMM d, yyyy HH:mm")}</p>
                    </div>
                  )}
                  {selectedContent.published_at && (
                    <div>
                      <span className="text-white/20">Published</span>
                      <p className="text-white/50">{format(new Date(selectedContent.published_at), "MMM d, yyyy HH:mm")}</p>
                    </div>
                  )}
                  {selectedContent.instagram_media_id && (
                    <div>
                      <span className="text-white/20">IG Media ID</span>
                      <p className="text-white/50 font-mono text-[11px]">{selectedContent.instagram_media_id}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialMediaOverview;
