import { AppShell, MainContent } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <AppShell>
      <MainContent className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Authentication coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is a placeholder page. Authentication will be implemented in a future update.
            </p>
          </CardContent>
        </Card>
      </MainContent>
    </AppShell>
  );
}
