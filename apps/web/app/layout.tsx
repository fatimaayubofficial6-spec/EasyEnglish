import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EasyEnglish - Master English with AI-Powered Learning",
  description:
    "Transform your English learning journey with AI-powered lessons, real-time feedback, and personalized practice. Join thousands of learners worldwide. Start free today!",
  keywords: [
    "English learning",
    "AI English tutor",
    "learn English online",
    "English language learning",
    "ESL",
    "English practice",
    "grammar checker",
    "pronunciation practice",
    "vocabulary builder",
    "language learning platform",
  ],
  authors: [{ name: "EasyEnglish Team" }],
  creator: "EasyEnglish",
  publisher: "EasyEnglish",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "EasyEnglish - Master English with AI-Powered Learning",
    description:
      "Transform your English learning journey with AI-powered lessons, real-time feedback, and personalized practice. Join thousands of learners worldwide.",
    type: "website",
    locale: "en_US",
    siteName: "EasyEnglish",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EasyEnglish - Master English with AI-Powered Learning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyEnglish - Master English with AI-Powered Learning",
    description:
      "Transform your English learning journey with AI-powered lessons, real-time feedback, and personalized practice.",
    images: ["/og-image.png"],
    creator: "@easyenglish",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EasyEnglish",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "9.99",
      priceCurrency: "USD",
      priceValidUntil: "2025-12-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "2547",
    },
    description:
      "Transform your English learning journey with AI-powered lessons, real-time feedback, and personalized practice.",
    image: "/og-image.png",
    author: {
      "@type": "Organization",
      name: "EasyEnglish Team",
    },
    provider: {
      "@type": "Organization",
      name: "EasyEnglish",
      url: "https://easyenglish.com",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
