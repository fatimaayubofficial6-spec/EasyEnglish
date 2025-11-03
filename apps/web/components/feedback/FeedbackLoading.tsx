"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedbackLoading() {
  return (
    <div className="space-y-8">
      {/* Success Celebration Skeleton */}
      <div className="flex flex-col items-center justify-center space-y-6 py-12">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-12 w-32 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
      </div>

      {/* Translation Diff Skeleton */}
      <Card className="glass">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>

      {/* Grammar Mistakes Skeleton */}
      <Card className="glass">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Actions Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Skeleton className="h-12 w-full sm:w-40" />
        <Skeleton className="h-12 w-full sm:w-40" />
        <Skeleton className="h-12 w-full sm:w-40" />
      </div>
    </div>
  );
}
