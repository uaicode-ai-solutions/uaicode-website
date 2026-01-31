import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar, Hash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BusinessPlanSection } from "@/types/report";
import { SharedChartRenderer } from "./SharedReportCharts";

// ==========================================
// Viability Score Badge Styling
// ==========================================
const getViabilityStyle = (score: number) => {
  if (score >= 80) return {
    bg: "bg-green-500/20",
    border: "border-green-500/30",
    text: "text-green-400",
  };
  if (score >= 60) return {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
  };
  return {
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
  };
};

// ==========================================
// Custom Markdown Components (Isolated copy)
// ==========================================
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-3xl font-bold text-gradient-gold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-foreground border-b border-accent/20 pb-2 mt-8 mb-4">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="ml-2">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <div className="p-4 rounded-xl bg-accent/10 border-l-4 border-accent my-4">
      {children}
    </div>
  ),
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const isInline = !className;
    if (isInline) {
      return <code className="bg-muted/50 px-1.5 py-0.5 rounded text-sm">{children}</code>;
    }
    return (
      <pre className="bg-muted/30 p-4 rounded-lg overflow-x-auto mb-4">
        <code className="text-sm">{children}</code>
      </pre>
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-6 overflow-hidden rounded-lg border border-accent/20">
      <Table>{children}</Table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <TableHeader className="bg-accent/10">{children}</TableHeader>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <TableBody>{children}</TableBody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <TableRow className="border-accent/10">{children}</TableRow>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <TableHead className="text-accent font-semibold">{children}</TableHead>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <TableCell className="text-muted-foreground">{children}</TableCell>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  hr: () => <hr className="my-8 border-accent/20" />,
};

// ==========================================
// Main SharedReportContent Component
// ==========================================
interface SharedReportContentProps {
  businessPlan: BusinessPlanSection;
}

const SharedReportContent = ({ businessPlan }: SharedReportContentProps) => {
  const viabilityStyle = getViabilityStyle(businessPlan.viability_score || 0);

  // Split markdown by chart placeholders and render inline charts
  const renderContentWithCharts = () => {
    const markdown = businessPlan.markdown_content || "";
    const chartsData = businessPlan.charts_data || {};
    
    // Split by [CHART:xxx] pattern
    const parts = markdown.split(/(\[CHART:\w+\])/g);
    
    return parts.map((part, index) => {
      const chartMatch = part.match(/\[CHART:(\w+)\]/);
      if (chartMatch) {
        const chartType = chartMatch[1];
        return <SharedChartRenderer key={index} type={chartType} data={chartsData} />;
      }
      // Regular markdown content
      return (
        <ReactMarkdown 
          key={index} 
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {part}
        </ReactMarkdown>
      );
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <Card className="glass-card border-accent/20 overflow-hidden">
        <div className="bg-gradient-to-r from-accent/20 to-accent/5 border-b border-accent/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title + Subtitle */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gradient-gold">
                {businessPlan.title || "Business Plan"}
              </h1>
              {businessPlan.subtitle && (
                <p className="text-muted-foreground mt-1">{businessPlan.subtitle}</p>
              )}
            </div>

            {/* Viability Score Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${viabilityStyle.bg} ${viabilityStyle.border}`}>
              <TrendingUp className={`h-5 w-5 ${viabilityStyle.text}`} />
              <span className={`font-semibold ${viabilityStyle.text}`}>
                {businessPlan.viability_label || "Score"}: {businessPlan.viability_score || 0}/100
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            {businessPlan.generated_at && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Generated: {new Date(businessPlan.generated_at).toLocaleDateString()}</span>
              </div>
            )}
            {businessPlan.word_count && (
              <div className="flex items-center gap-1.5">
                <Hash className="h-4 w-4" />
                <span>{businessPlan.word_count.toLocaleString()} words</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Markdown Content with Charts */}
      <Card className="glass-card border-accent/20">
        <CardContent className="p-6 md:p-8 prose prose-invert max-w-none">
          {renderContentWithCharts()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedReportContent;
