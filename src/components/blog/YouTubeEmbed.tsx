import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  customThumbnail?: string;
}

export const YouTubeEmbed = ({ videoId, title = "YouTube video", customThumbnail }: YouTubeEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const shouldLoadIframe = isVisible && (isPlaying || !customThumbnail);

  return (
    <div ref={containerRef}>
      <div className="relative w-full rounded-2xl overflow-hidden border border-accent/20 shadow-[0_0_40px_rgba(234,171,8,0.15)] hover:shadow-accent/20 transition-shadow duration-300" style={{ paddingBottom: '56.25%' }}>
        {!isPlaying && customThumbnail ? (
          <button
            onClick={handlePlay}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlay();
              }
            }}
            className="absolute top-0 left-0 w-full h-full group cursor-pointer"
            aria-label="Play video"
          >
            <img
              src={customThumbnail}
              alt={title}
              className="absolute top-0 left-0 w-full h-full object-cover object-[center_20%]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 sm:w-12 sm:h-12 text-accent-foreground ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        ) : shouldLoadIframe && videoId ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full animate-fade-in"
            src={`https://www.youtube-nocookie.com/embed/${videoId}${isPlaying ? '?autoplay=1' : ''}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : null}
      </div>
    </div>
  );
};
