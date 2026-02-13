import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNewsletterPosts } from "@/hooks/useNewsletterPosts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, ArrowUpNarrowWide, ArrowDownNarrowWide, Youtube, Radio, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import NewsletterSuccessDialog from "@/components/newsletter/NewsletterSuccessDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import heroImage from "@/assets/newsletter-hero.webp";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
  youtubeVideoId?: string;
  highlights?: string[];
  subtitles?: string[];
}

const newsletterSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .refine(
      (email) => !email.includes('+'),
      "Please use a standard email address without '+' symbols"
    ),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const Newsletter = () => {
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const { data: dbPosts = [], isLoading: isLoadingPosts } = useNewsletterPosts();

  const allPosts = dbPosts;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailValue = watch("email");
  const emailCharCount = emailValue?.length || 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Extract unique categories
  const allCategories = ["All Categories", ...Array.from(new Set(allPosts.map(post => post.category)))];

  // Filter posts based on search and category, then sort chronologically
  const filteredPosts = allPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      
      // Sort based on direction: asc = oldest first, desc = newest first
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const onNewsletterSubmit = async (data: NewsletterFormData) => {
    try {
      const sanitizedEmail = data.email.trim().toLowerCase();

      // First, try to insert into Supabase
      const { error: dbError } = await supabase
        .from('tb_web_newsletter')
        .insert({ 
          email: sanitizedEmail, 
          source: 'newsletter_hero' 
        });

      // Handle duplicate email error
      if (dbError?.code === '23505') {
        console.log("Email already subscribed");
        return;
      }

      if (dbError) {
        throw dbError;
      }
      
      // Send welcome email (best-effort, don't block success)
      supabase.functions.invoke('send-newsletter-welcome', {
        body: { email: sanitizedEmail, source: 'newsletter_hero' }
      }).then(({ error }) => {
        if (error) console.error('Welcome email error:', error);
      }).catch(err => console.error('Welcome email fetch error:', err));

      // Call the webhook
      fetch(
        "https://uaicode-n8n.ax5vln.easypanel.host/webhook/a95bfd22-a4e0-48b2-b88d-bec4bfe84be4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: sanitizedEmail,
            timestamp: new Date().toISOString(),
            source: "newsletter_hero",
          }),
        }
      ).catch(err => console.error('Webhook error:', err));

      // Show success dialog
      reset();
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    }
  };

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <NewsletterSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">
                  UAICODE <span className="text-gradient-gold">INSIGHTS</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Expert insights, practical guides, and industry trends to help you build and scale your SaaS products
                </p>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit(onNewsletterSubmit)} className="space-y-4">
                <div className="glass-card p-6 rounded-xl space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        {...register("email")}
                        className="pl-12 py-6 text-lg bg-background/50 border-border"
                        disabled={isSubmitting}
                        maxLength={255}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{emailCharCount}/255 characters</p>
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    By signing up I accept the terms of the{" "}
                    <Link to="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link to="/terms" className="text-accent hover:underline">
                      Terms of Use
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08]">
                <img
                  src={heroImage}
                  alt="AI Newsletter Hero"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Latest <span className="text-gradient-gold">Insights</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Expert perspectives on AI, automation, and business transformation
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* Search Bar */}
              <div className="w-full md:w-96">
                <Input
                  type="text"
                  placeholder="Search posts by title..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full"
                />
              </div>
              
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Sort Direction Toggle */}
              <Button
                variant="outline"
                onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                className="w-full md:w-auto flex items-center gap-2"
              >
                {sortDirection === "asc" ? (
                  <>
                    <ArrowUpNarrowWide className="h-4 w-4" />
                    <span>Oldest First</span>
                  </>
                ) : (
                  <>
                    <ArrowDownNarrowWide className="h-4 w-4" />
                    <span>Newest First</span>
                  </>
                )}
              </Button>
              
              {/* Posts Per Page Selector */}
              <Select
                value={postsPerPage.toString()}
                onValueChange={(value) => {
                  setPostsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 posts per page</SelectItem>
                <SelectItem value="6">6 posts per page</SelectItem>
                <SelectItem value="9">9 posts per page</SelectItem>
                <SelectItem value="12">12 posts per page</SelectItem>
              </SelectContent>
              </Select>
            </div>
            
            {/* Results Count */}
            <p className="text-sm text-muted-foreground text-center">
              Showing {currentPosts.length} of {filteredPosts.length} posts
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <BlogCard key={post.id} post={post} onClick={() => handleBlogClick(post.slug)} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No posts found matching your criteria.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* More Ways to Learn Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              More Ways to <span className="text-gradient-gold">Learn</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our video tutorials and podcast episodes for deeper insights into AI, automation, and SaaS development
            </p>
          </div>

          {/* Platform Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* YouTube Card */}
            <a 
              href="https://www.youtube.com/@uaicodeai"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 rounded-2xl hover-lift transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <Youtube className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Watch on YouTube</h3>
                <p className="text-muted-foreground">
                  Video tutorials, case studies, and expert insights on AI-powered MVP development
                </p>
                <div className="flex items-center text-accent font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  Visit Channel
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </a>

            {/* Spotify Card */}
            <a 
              href="https://open.spotify.com/show/0TzK81gwC16gvPkLhIVzXg"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 rounded-2xl hover-lift transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                  <Radio className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Listen on Spotify</h3>
                <p className="text-muted-foreground">
                  Podcast episodes featuring founder stories, industry trends, and practical advice
                </p>
                <div className="flex items-center text-accent font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  Listen Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Newsletter;
