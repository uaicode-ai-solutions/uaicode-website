import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const ReportCardSkeleton = () => (
  <Card className="glass-premium border-accent/10 overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton variant="premium" className="h-5 w-3/4 mb-2" />
          <Skeleton variant="premium" className="h-4 w-1/2" />
        </div>
        <Skeleton variant="premium" className="h-8 w-8 rounded-full" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="premium" className="h-8 w-16" />
          <Skeleton variant="premium" className="h-4 w-12" />
        </div>
        <Skeleton variant="premium" className="h-2 w-full rounded-full" />
        <Skeleton variant="premium" className="h-3 w-24" />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
        <Skeleton variant="premium" className="h-4 w-24" />
        <Skeleton variant="premium" className="h-8 w-20 rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

export default ReportCardSkeleton;
