import { AppShell, MainContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <AppShell>
      <MainContent className="flex items-center justify-center">
        <div className="w-full max-w-5xl space-y-16 py-12">
          <div className="text-center">
            <Badge className="mb-4" variant="outline">
              ✨ Welcome to EasyEnglish
            </Badge>
            <h1 className="mb-6">
              Learn English the <span className="gradient-text">Easy Way</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Your journey to mastering English starts here. Experience personalized lessons powered
              by AI and interactive practice sessions.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg">Get Started</Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="glass-hover">
              <CardHeader>
                <CardTitle>📚 Interactive Lessons</CardTitle>
                <CardDescription>
                  Engage with dynamic content tailored to your learning level
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-hover">
              <CardHeader>
                <CardTitle>🤖 AI-Powered</CardTitle>
                <CardDescription>
                  Get personalized feedback and recommendations from our AI assistant
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-hover">
              <CardHeader>
                <CardTitle>📈 Track Progress</CardTitle>
                <CardDescription>
                  Monitor your improvement with detailed analytics and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </MainContent>
    </AppShell>
  );
}
