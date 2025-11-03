import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell, MainContent } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function MyPdfPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <AppShell>
      <MainContent id="main-content">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My PDF Library</h1>
            <p className="text-muted-foreground mt-2">
              Upload and manage your PDF documents for learning
            </p>
          </div>

          <Card className="glass">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <CardTitle>PDF Library Coming Soon</CardTitle>
              </div>
              <CardDescription>
                We&apos;re working on PDF upload and management features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Soon you&apos;ll be able to upload your own PDF documents, extract text, and
                create custom exercises from your materials.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainContent>
    </AppShell>
  );
}
