import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell, MainContent } from "@/components/layout";
import { PdfTextbook } from "@/components/pdf/PdfTextbook";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/models/User";

export default async function MyPdfPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  await connectDB();

  // Fetch user data to get PDF info
  const userData = await User.findById(user.id).lean();

  if (!userData) {
    redirect("/auth/signin");
  }

  return (
    <AppShell>
      <MainContent id="main-content">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Learning Textbook</h1>
            <p className="text-muted-foreground mt-2">
              Your personalized PDF textbook with all your completed lessons
            </p>
          </div>

          <PdfTextbook
            pdfUrl={userData.pdfUrl}
            lessonsCount={userData.pdfLessonsCount || 0}
            lastUpdated={userData.pdfLastUpdated}
          />
        </div>
      </MainContent>
    </AppShell>
  );
}
