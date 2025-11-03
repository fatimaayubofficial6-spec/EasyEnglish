"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Loader2, Shield, CreditCard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canceled = searchParams.get("canceled");
  const fromPath = searchParams.get("from");

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const benefits = [
    "Unlimited exercise attempts",
    "Advanced AI feedback and analysis",
    "Access to all difficulty levels",
    "Personalized learning recommendations",
    "Priority support",
    "Download your progress reports",
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards through our secure Stripe payment processor.",
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use Stripe, an industry-leading payment processor trusted by millions. We never store your card details.",
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 14-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold gradient-text">
            Upgrade to Premium
          </h1>
          <p className="text-lg text-muted-foreground">
            Unlock the full power of EasyEnglish and accelerate your learning
          </p>
        </div>

        {fromPath && (
          <Alert className="mb-8">
            <AlertDescription>
              You need an active premium subscription to access this feature. Subscribe now to continue!
            </AlertDescription>
          </Alert>
        )}

        {canceled && (
          <Alert className="mb-8">
            <AlertDescription>
              Your checkout was canceled. No charges were made. Feel free to try again when you're ready!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="glass mb-12">
          <CardHeader className="text-center">
            <Badge className="mx-auto mb-4 w-fit">Most Popular</Badge>
            <CardTitle className="text-3xl">Premium Plan</CardTitle>
            <CardDescription className="text-xl">
              <span className="text-4xl font-bold text-foreground">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSubscribe}
              disabled={isLoading || !session}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </Button>

            {!session && (
              <p className="text-center text-sm text-muted-foreground">
                Please sign in to subscribe
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card className="glass-hover">
            <CardHeader>
              <Shield className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your payment information is encrypted and secure with Stripe
              </p>
            </CardContent>
          </Card>

          <Card className="glass-hover">
            <CardHeader>
              <CreditCard className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Easy Cancellation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cancel anytime from your account settings, no questions asked
              </p>
            </CardContent>
          </Card>

          <Card className="glass-hover">
            <CardHeader>
              <Check className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-lg">Money-Back Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                14-day money-back guarantee if you're not satisfied
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="glass rounded-lg p-6">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <SubscribeContent />
    </Suspense>
  );
}
