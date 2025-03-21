import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { getCurrentUser } from "~/utils/session";
import { HeroSection } from "./-components/hero";
import { CodePreviewSection } from "./-components/code-preview";
import { ModulesSection } from "./-components/modules";
import { TestimonialsSection } from "./-components/testimonials";
import { PricingSection } from "./-components/pricing";
import { FAQSection } from "./-components/faq";
import { FooterSection } from "./-components/footer";

const getUserInfoFn = createServerFn().handler(async () => {
  const user = await getCurrentUser();
  return { user };
});

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const userInfo = useSuspenseQuery({
    queryKey: ["user-info"],
    queryFn: () => getUserInfoFn(),
  });

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
