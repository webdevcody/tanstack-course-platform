import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "./-components/hero";
import { CodePreviewSection } from "./-components/code-preview";
import { ModulesSection } from "./-components/modules";
import { TestimonialsSection } from "./-components/testimonials";
import { PricingSection } from "./-components/pricing";
import { FAQSection } from "./-components/faq";
import { FooterSection } from "./-components/footer";
import { NewsletterSection } from "./-components/newsletter";
import { createServerFn } from "@tanstack/start";
import { getSegments } from "~/data-access/segments";
import { env } from "~/utils/env";

const loaderFn = createServerFn().handler(async () => {
  const segments = await getSegments();

  return { segments };
});

export const Route = createFileRoute("/")({
  component: Home,
  loader: () => loaderFn(),
});

function Home() {
  const { segments } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroSection />
      <CodePreviewSection />
      <NewsletterSection />
      <ModulesSection segments={segments} />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
