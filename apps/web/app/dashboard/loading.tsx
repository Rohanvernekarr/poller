export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24 pb-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-16 w-64 bg-foreground/10 rounded-2xl" />
            <div className="h-3 w-80 bg-foreground/5 rounded-full" />
          </div>
          <div className="h-12 w-40 bg-foreground/10 rounded-2xl" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-foreground/[0.02] border border-border/50 rounded-3xl p-6 space-y-6 animate-pulse h-[380px] flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="h-6 w-3/4 bg-foreground/10 rounded-lg" />
                    <div className="flex gap-4">
                      <div className="h-2 w-12 bg-foreground/5 rounded-full" />
                      <div className="h-2 w-16 bg-foreground/5 rounded-full" />
                    </div>
                  </div>
                  <div className="h-9 w-9 bg-foreground/5 rounded-xl" />
                </div>

                {/* Mini Chart Skeleton */}
                <div className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-2 w-20 bg-foreground/5 rounded-full" />
                        <div className="h-2 w-8 bg-foreground/5 rounded-full" />
                      </div>
                      <div className="h-1.5 w-full bg-foreground/5 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 flex-1 bg-foreground/5 rounded-xl" />
                <div className="h-10 flex-1 bg-foreground/5 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
