import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "./-components/hero";
import { CodePreviewSection } from "./-components/code-preview";
import { ModulesSection } from "./-components/modules";
import { TestimonialsSection } from "./-components/testimonials";
import { PricingSection } from "./-components/pricing";
import { FAQSection } from "./-components/faq";
import { FooterSection } from "./-components/footer";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection />
      <CodePreviewSection />
      <ModulesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
