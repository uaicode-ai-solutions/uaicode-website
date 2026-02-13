import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";

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

interface BlogCardProps {
  post: BlogPost;
  onClick?: () => void;
}

const BlogCard = ({ post, onClick }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <article 
      className="glass-card rounded-xl overflow-hidden hover-lift cursor-pointer group transition-all duration-400"
      onClick={onClick}
    >
      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={post.imageUrl} 
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <Badge 
          variant="default" 
          className="absolute top-4 left-4 bg-accent text-accent-foreground"
        >
          {post.category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-2xl font-bold line-clamp-2 group-hover:text-accent transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author & Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png";
              }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{post.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(post.publishedAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{post.readTime}</span>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
