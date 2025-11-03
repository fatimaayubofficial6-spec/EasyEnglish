"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <Card className="glass">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No exercises found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            We couldn&apos;t find any exercises matching your filters. Try adjusting your search criteria.
          </p>
          <Button onClick={onClearFilters} variant="outline">
            Clear Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No exercises available yet</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          We&apos;re working hard to add new exercises. Check back soon or contact support for more information.
        </p>
        <Button variant="outline" className="gap-2">
          <Mail className="h-4 w-4" />
          Contact Support
        </Button>
      </CardContent>
    </Card>
  );
}
