import { AppShell, MainContent } from "@/components/layout";
import {
  HeroSection,
  GlobeSection,
  HowItWorksSection,
  DemoWidget,
  TestimonialsCarousel,
  PricingSection,
  FAQSection,
} from "@/components/landing";

export default function Home() {
  return (
    <AppShell>
      <MainContent id="main-content" containerClassName="p-0">
        <HeroSection />
        <GlobeSection />
        <HowItWorksSection />
        <DemoWidget />
        <TestimonialsCarousel />
        <PricingSection />
        <FAQSection />
      </MainContent>
    </AppShell>
  );
}
