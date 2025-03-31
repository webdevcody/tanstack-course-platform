import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "./-components/hero";
import { CodePreviewSection } from "./-components/code-preview";
import { ModulesSection } from "./-components/modules";
import { PricingSection } from "./-components/pricing";
import { FAQSection } from "./-components/faq";
import { createServerFn } from "@tanstack/react-start";
import { getSegments } from "~/data-access/segments";

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
      <ModulesSection segments={segments} />
      <CodePreviewSection />
      {/* <TestimonialsSection /> */}
      <PricingSection />
      {/* <NewsletterSection /> */}
      <FAQSection />
    </div>
  );
}
