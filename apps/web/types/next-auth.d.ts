import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscriptionStatus: string;
      subscriptionTier: string;
      onboardingCompleted: boolean;
      nativeLanguage?: string;
      nativeLanguageName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isNewUser?: boolean;
    subscriptionStatus?: string;
    subscriptionTier?: string;
    onboardingCompleted?: boolean;
    nativeLanguage?: string;
    nativeLanguageName?: string;
  }
}
