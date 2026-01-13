import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const DashboardSkeleton = () => (
  <div className="space-y-8 py-6">
    {/* Hero Skeleton */}
    <div className="text-center space-y-4">
      <Skeleton variant="premium" className="h-10 w-64 mx-auto" />
      <Skeleton variant="premium" className="h-5 w-96 mx-auto" />
      <div className="flex justify-center gap-3 mt-6">
        <Skeleton variant="premium" className="h-10 w-32 rounded-lg" />
        <Skeleton variant="premium" className="h-10 w-32 rounded-lg" />
      </div>
    </div>

    {/* Score Circle Skeleton */}
    <div className="flex justify-center">
      <Skeleton variant="premium" className="h-40 w-40 rounded-full" />
    </div>

    {/* Cards Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="glass-premium border-accent/10">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="premium" className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton variant="premium" className="h-5 w-3/4 mb-2" />
                <Skeleton variant="premium" className="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton variant="premium" className="h-20 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Section Skeleton */}
    <div className="space-y-4">
      <Skeleton variant="premium" className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton variant="premium" className="h-32 w-full rounded-xl" />
        <Skeleton variant="premium" className="h-32 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
