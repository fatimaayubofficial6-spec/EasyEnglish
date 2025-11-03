"use client";

import { AppShell, MainContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MotionCard, FadeInOnScroll, StaggerContainer } from "@/lib/motion";
import { m } from "framer-motion";
import { staggerItemVariants } from "@/lib/motion";
import { AlertCircle, Info } from "lucide-react";

export default function UIKitPage() {
  return (
    <AppShell>
      <MainContent>
        <div className="space-y-12">
          <FadeInOnScroll>
            <div className="text-center">
              <h1 className="gradient-text mb-4">EasyEnglish UI Kit</h1>
              <p className="text-lg text-muted-foreground">
                A comprehensive showcase of all design system components and motion utilities.
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.1}>
            <section className="space-y-6">
              <h2>Colors & Typography</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Primary Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-md bg-primary" />
                      <span className="text-sm">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-md bg-accent" />
                      <span className="text-sm">Accent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-md bg-secondary" />
                      <span className="text-sm">Secondary</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="gradient-text">Gradient Text</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      The gradient-text utility applies the EasyEnglish brand gradient.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass-hover">
                  <CardHeader>
                    <CardTitle>Glassmorphism</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This card uses the glass-hover utility for a subtle glassmorphic effect.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.2}>
            <section className="space-y-6">
              <h2>Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive Button</Button>
                <Button variant="link">Link Button</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🚀</Button>
              </div>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.3}>
            <section className="space-y-6">
              <h2>Badges</h2>
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.4}>
            <section className="space-y-6">
              <h2>Alerts</h2>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This is an informational alert with default styling.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    This is a destructive alert for error messages.
                  </AlertDescription>
                </Alert>
              </div>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.5}>
            <section className="space-y-6">
              <h2>Input & Forms</h2>
              <Card className="glass max-w-md">
                <CardHeader>
                  <CardTitle>Form Example</CardTitle>
                  <CardDescription>Enter your information below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <Button className="w-full">Submit</Button>
                </CardContent>
              </Card>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.6}>
            <section className="space-y-6">
              <h2>Dialog</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="glass">
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      This is a dialog component with glassmorphic styling.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                      Dialog content goes here. You can add forms, text, or any other components.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.7}>
            <section className="space-y-6">
              <h2>Tabs</h2>
              <Tabs defaultValue="account" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-4">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>
                        Make changes to your account here. Click save when you're done.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Input placeholder="Username" />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="password" className="space-y-4">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>
                        Change your password here. After saving, you'll be logged out.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.8}>
            <section className="space-y-6">
              <h2>Accordion</h2>
              <Accordion type="single" collapsible className="glass w-full max-w-md rounded-lg p-4">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is EasyEnglish?</AccordionTrigger>
                  <AccordionContent>
                    EasyEnglish is an interactive platform for learning English with personalized
                    lessons and AI-powered assistance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does it work?</AccordionTrigger>
                  <AccordionContent>
                    Our platform uses advanced AI to adapt to your learning style and provide
                    personalized lessons.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it free?</AccordionTrigger>
                  <AccordionContent>
                    We offer both free and premium plans to suit your learning needs.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.9}>
            <section className="space-y-6">
              <h2>Tooltip</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={1.0}>
            <section className="space-y-6">
              <h2>Skeleton Loaders</h2>
              <div className="space-y-4">
                <Card className="glass">
                  <CardHeader>
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              </div>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={1.1}>
            <section className="space-y-6">
              <h2>Motion Utilities</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-xl font-semibold">MotionCard</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <MotionCard delay={0}>
                      <Card className="glass">
                        <CardHeader>
                          <CardTitle>Card 1</CardTitle>
                          <CardDescription>Animates on mount</CardDescription>
                        </CardHeader>
                      </Card>
                    </MotionCard>
                    <MotionCard delay={0.1}>
                      <Card className="glass">
                        <CardHeader>
                          <CardTitle>Card 2</CardTitle>
                          <CardDescription>With delay</CardDescription>
                        </CardHeader>
                      </Card>
                    </MotionCard>
                    <MotionCard delay={0.2}>
                      <Card className="glass">
                        <CardHeader>
                          <CardTitle>Card 3</CardTitle>
                          <CardDescription>Staggered animation</CardDescription>
                        </CardHeader>
                      </Card>
                    </MotionCard>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold">StaggerContainer</h3>
                  <StaggerContainer className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                      <m.div key={i} variants={staggerItemVariants}>
                        <Card className="glass-hover">
                          <CardHeader>
                            <CardTitle>Item {i}</CardTitle>
                          </CardHeader>
                        </Card>
                      </m.div>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            </section>
          </FadeInOnScroll>

          <FadeInOnScroll delay={1.2}>
            <section className="space-y-6">
              <h2>Custom Animations</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass animate-fade-in">
                  <CardHeader>
                    <CardTitle>Fade In</CardTitle>
                    <CardDescription>Uses CSS animation</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass animate-slide-in-up">
                  <CardHeader>
                    <CardTitle>Slide In Up</CardTitle>
                    <CardDescription>From bottom to top</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="glass animate-scale-in">
                  <CardHeader>
                    <CardTitle>Scale In</CardTitle>
                    <CardDescription>Zooms into view</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </section>
          </FadeInOnScroll>
        </div>
      </MainContent>
    </AppShell>
  );
}
