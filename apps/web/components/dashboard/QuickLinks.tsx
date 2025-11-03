"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Settings } from "lucide-react";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";

interface QuickLinksProps {
  hasStripeCustomerId: boolean;
}

export function QuickLinks({ hasStripeCustomerId }: QuickLinksProps) {
  return (
    <Card className="glass">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="space-y-2">
          <Link href="/my-pdf" className="block">
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText className="h-4 w-4" />
              My PDF Library
            </Button>
          </Link>

          {hasStripeCustomerId && (
            <ManageSubscriptionButton className="w-full justify-start gap-2" variant="outline">
              <Settings className="h-4 w-4" />
              Manage Subscription
            </ManageSubscriptionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
