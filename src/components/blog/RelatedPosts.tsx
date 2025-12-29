import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  category: string;
  posts: BlogPost[];
}

export const RelatedPosts = ({ currentPostId, category, posts }: RelatedPostsProps) => {
  const navigate = useNavigate();

  const relatedPosts = posts
    .filter(post => post.category === category && post.id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-border/50 pt-12 mt-12">
      <h3 className="text-2xl md:text-3xl font-bold text-accent mb-8">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {relatedPosts.map((post) => (
          <BlogCard 
            key={post.id} 
            post={post} 
            onClick={() => navigate(`/blog/${post.slug}`)}
          />
        ))}
      </div>
      <div className="text-center mt-12">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => navigate('/newsletter')}
          className="gap-2 border-accent/30 hover:bg-accent hover:text-background transition-all duration-300 hover:scale-105 px-8"
        >
          View All Blog Posts
        </Button>
      </div>
    </div>
  );
};
