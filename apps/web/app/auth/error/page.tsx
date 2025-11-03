"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account.";
      case "OAuthCallback":
        return "An error occurred during the authentication process.";
      case "OAuthCreateAccount":
        return "Could not create an account with the provided information.";
      case "EmailCreateAccount":
        return "Could not create an account with the provided email.";
      case "Callback":
        return "An error occurred in the authentication callback.";
      case "OAuthSignin":
        return "An error occurred while trying to sign in with OAuth provider.";
      case "EmailSignin":
        return "Could not send sign in email.";
      case "CredentialsSignin":
        return "Sign in failed. Check your credentials and try again.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "An unexpected error occurred during authentication.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="gradient-text text-3xl font-bold">EasyEnglish</h1>
          </Link>
        </div>

        <Card className="glass-hover">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">Authentication Error</CardTitle>
            <CardDescription className="text-center">{getErrorMessage()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg" asChild>
              <Link href="/auth/signin">Try Again</Link>
            </Button>
            <Button className="w-full" size="lg" variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
