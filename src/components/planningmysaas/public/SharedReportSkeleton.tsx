import { Skeleton } from "@/components/ui/skeleton";

const SharedReportSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-accent/10">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-8 w-40 rounded-full" />
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 space-y-6">
          {/* Hero Card Skeleton */}
          <div className="glass-card border-accent/20 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-accent/20 to-accent/5 border-b border-accent/20 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-40 rounded-full" />
              </div>
              <div className="flex gap-4 mt-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="glass-card border-accent/20 rounded-lg p-6 md:p-8 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <Skeleton className="h-6 w-40" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedReportSkeleton;
