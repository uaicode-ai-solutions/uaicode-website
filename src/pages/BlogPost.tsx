import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useLayoutEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SocialShareButtons } from "@/components/blog/SocialShareButtons";
import { HighlightedText } from "@/components/blog/HighlightedText";
import { YouTubeEmbed } from "@/components/blog/YouTubeEmbed";
import { FounderCard } from "@/components/blog/FounderCard";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BackToTopButton } from "@/components/blog/BackToTopButton";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { CourseBanners } from "@/components/blog/CourseBanners";
import { Calendar, Clock, User } from "lucide-react";
import { useNewsletterPosts } from "@/hooks/useNewsletterPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const metaRef = useRef<HTMLDivElement>(null);
  const [metaHeight, setMetaHeight] = useState(0);
  const { data: dbPosts = [], isLoading } = useNewsletterPosts();

  const allPosts = dbPosts;

  const post = allPosts.find(p => p.slug === slug);

  useLayoutEffect(() => {
    const measure = () => setMetaHeight(metaRef.current?.offsetHeight ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!post && !isLoading) {
      navigate('/newsletter');
    }
  }, [post, isLoading, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!post) {
    return isLoading ? (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    ) : null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ReadingProgressBar />
      <Header />
      
      <main className="flex-1 pt-20">
        <article className="mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Unified Grid with Social Share and Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] xl:grid-cols-[80px_1fr_250px] gap-6 lg:gap-10 max-w-7xl mx-auto">
            {/* Sticky Social Share Sidebar (Desktop) */}
            <aside className="hidden lg:block w-[80px]">
              <div className="sticky top-24" style={{ marginTop: metaHeight }}>
                <SocialShareButtons orientation="vertical" />
              </div>
            </aside>

            {/* Main Content Column */}
            <div className="min-w-0">
              {/* Hero Section */}
              <header className="mb-12 md:mb-16">
                {/* Meta Info */}
                <div ref={metaRef} className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6 md:mb-8">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </div>
                  <span className="text-muted-foreground/50">•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                  <span className="text-muted-foreground/50">•</span>
                  <div className="px-2.5 py-1 rounded-full bg-accent text-background text-xs font-semibold">
                    {post.category}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent leading-[1.1]">
                  {post.title}
                </h1>

                {/* Author */}
                <div className="flex items-center gap-4 mb-12">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-full border-2 border-accent shadow-lg"
                  />
                  <div>
                    <div className="font-bold text-lg text-foreground">{post.author.name}</div>
                    <div className="text-sm text-accent font-semibold">Author</div>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl mb-12 md:mb-16 border border-accent/30 hover:shadow-accent/20 transition-shadow duration-300">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-auto max-h-[400px] md:max-h-[600px] object-cover transition-all duration-500 ease-out hover:scale-105 hover:brightness-110"
                  />
                </div>
              </header>

              {/* Content */}
              <div className="prose prose-lg prose-invert max-w-none prose-headings:scroll-mt-20">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ children, ...props }) => {
                      const text = String(children);
                      const isHighlighted = post.highlights?.includes(text);
                      
                      if (isHighlighted) {
                        return <HighlightedText>{text}</HighlightedText>;
                      }
                      return <strong {...props}>{children}</strong>;
                    },
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const isSubtitle = post.subtitles?.includes(text);
                      
                      if (isSubtitle) {
                        return <HighlightedText variant="subtitle">{text}</HighlightedText>;
                      }
                      return <h2 {...props}>{children}</h2>;
                    },
                    a: ({ children, href, ...props }) => {
                      const isBooking = href?.includes('/booking');
                      return (
                        <a 
                          href={href}
                          {...props}
                          target={isBooking ? "_blank" : undefined}
                          rel={isBooking ? "noopener noreferrer" : undefined}
                          className="text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent hover:text-accent/90 transition-colors duration-200"
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Mobile Social Share */}
              <div className="lg:hidden mt-10 mb-10">
                <SocialShareButtons orientation="horizontal" />
              </div>

              {/* YouTube Video Embed */}
              {post.youtubeVideoId && (
                <YouTubeEmbed 
                  videoId={post.youtubeVideoId} 
                  title={post.title}
                />
              )}
            </div>

            {/* Right Sidebar - Course Banners (Desktop XL+) */}
            <aside className="hidden xl:block w-[250px]">
              <div className="sticky top-24">
                <CourseBanners />
              </div>
            </aside>
          </div>

          {/* Footer Sections with Mixed Width Alignment */}
          <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] xl:grid-cols-[80px_1fr_250px] gap-6 lg:gap-10 max-w-7xl mx-auto mt-12 md:mt-16">
            {/* Empty space for social sidebar alignment */}
            <div className="hidden lg:block" />
            
            {/* About Founder - Middle Column Only */}
            <div>
              <FounderCard />
            </div>
            
            {/* Empty space for course sidebar alignment */}
            <div className="hidden xl:block" />
            
            {/* Related Articles - Full Width Spanning All Columns */}
            <div className="col-span-full mt-12 md:mt-16">
              <RelatedPosts 
                currentPostId={post.id}
                category={post.category}
                posts={allPosts}
              />
            </div>
          </div>
        </article>
      </main>

      <Footer />
      
      <BackToTopButton />
    </div>
  );
};

export default BlogPost;
