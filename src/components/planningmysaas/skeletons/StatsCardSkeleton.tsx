import { Skeleton } from "@/components/ui/skeleton";

const StatsCardSkeleton = () => (
  <div className="glass-card rounded-xl p-4 text-center border border-accent/10">
    <div className="flex items-center justify-center gap-2 mb-2">
      <Skeleton variant="premium" className="h-4 w-4 rounded" />
      <Skeleton variant="premium" className="h-7 w-12" />
    </div>
    <Skeleton variant="premium" className="h-3 w-20 mx-auto" />
  </div>
);

export default StatsCardSkeleton;
