import { AppShell, MainContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FeedbackPage({ params }: { params: { attemptId: string } }) {
  return (
    <AppShell>
      <MainContent id="main-content">
        <div className="space-y-6">
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Exercise Feedback</CardTitle>
              <CardDescription>Attempt ID: {params.attemptId}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The feedback page is under construction. Your submission has been recorded successfully.
              </p>
              <div className="mt-6">
                <Link href="/dashboard">
                  <Button size="lg">Return to Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </AppShell>
  );
}
