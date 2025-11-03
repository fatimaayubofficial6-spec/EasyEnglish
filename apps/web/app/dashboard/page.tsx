import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppShell, MainContent } from "@/components/layout";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  await connectDB();
  const dbUser = await User.findOne({ email: user.email }).lean();

  return (
    <AppShell>
      <MainContent id="main-content">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
            <p className="text-muted-foreground">Here&apos;s your learning dashboard</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>View and edit your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-12 w-12 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
                <CardDescription>Continue your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lesson content will be available soon.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Track your learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Progress tracking will be available soon.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Plan:</span>
                    <span className="text-sm font-medium capitalize">
                      {dbUser?.subscriptionTier || "free"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-sm font-medium capitalize">
                      {dbUser?.subscriptionStatus || "active"}
                    </span>
                  </div>
                  {dbUser?.nextBillingDate && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Next billing:</span>
                      <span className="text-sm font-medium">
                        {new Date(dbUser.nextBillingDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                {dbUser?.stripeCustomerId && (
                  <ManageSubscriptionButton />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainContent>
    </AppShell>
  );
}
