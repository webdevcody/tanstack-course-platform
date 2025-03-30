import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { stripe } from "~/lib/stripe";
import { authenticatedMiddleware } from "~/lib/auth";
import { env } from "~/utils/env";
import { loadStripe } from "@stripe/stripe-js";
import { publicEnv } from "~/utils/env-public";
import { isAuthenticatedFn } from "~/fn/auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "~/components/ui/button";
import {
  Check,
  Lock,
  Star,
  Users,
  Clock,
  Sparkles,
  Trophy,
  Code,
  RefreshCcw,
} from "lucide-react";

export const Route = createFileRoute("/purchase")({
  component: RouteComponent,
});

const checkoutFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .handler(async ({ context }) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: "payment",
      success_url: `${env.HOST_NAME}/success`,
      cancel_url: `${env.HOST_NAME}/purchase`,
      metadata: { userId: context.userId },
    });

    return { sessionId: session.id };
  });

const features = [
  {
    title: "20 Beginner React Challenges",
    description:
      "Learn React through hands-on practice with carefully crafted challenges",
    icon: Code,
  },
  {
    title: "Problem-Solving Approach",
    description:
      "Master the art of breaking down complex problems with whiteboarding",
    icon: Sparkles,
  },
  {
    title: "Step-by-Step Guidance",
    description: "Detailed explanations and solution code for each challenge",
    icon: Star,
  },
  {
    title: "Discord Community",
    description: "Get help and discuss solutions with other learners",
    icon: Users,
  },
  {
    title: "React Fundamentals",
    description: "Build a strong foundation in React concepts and patterns",
    icon: Trophy,
  },
  {
    title: "Lifetime Access",
    description: "Access all challenges and future updates at your own pace",
    icon: RefreshCcw,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "Tech Corp",
    text: "The problem-solving approach really helped me understand React better. Breaking down each challenge step by step made everything click.",
  },
  {
    name: "Michael Rodriguez",
    role: "React Developer",
    company: "StartupX",
    text: "These challenges helped me build a solid foundation in React. The whiteboarding sessions were especially helpful for understanding complex problems.",
  },
];

function RouteComponent() {
  const { data: isAuthenticated } = useSuspenseQuery({
    queryKey: ["isAuthenticated"],
    queryFn: () => isAuthenticatedFn(),
  });

  const handlePurchase = async () => {
    const stripePromise = loadStripe(publicEnv.VITE_STRIPE_PUBLISHABLE_KEY);
    const stripeResolved = await stripePromise;
    if (!stripeResolved) throw new Error("Stripe failed to initialize");

    try {
      const { sessionId } = await checkoutFn();
      const { error } = await stripeResolved.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.05)_0%,transparent_65%)] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)] p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                Authentication Required
              </h2>
              <p className="text-gray-300 mb-6">
                Please login to access the full course content and make a
                purchase
              </p>
              <a href="/api/login/google">
                <Button
                  size="lg"
                  className="font-semibold bg-theme-400 hover:bg-theme-500 text-black"
                >
                  Login with Google
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.05)_0%,transparent_65%)] pointer-events-none" />

      <div className="container mx-auto py-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-theme-400 font-medium mb-4">
              <Sparkles className="h-5 w-5" />
              <span>Limited Time Offer - 60% OFF</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white bg-clip-text">
              20 Beginner React Challenges
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Master React through hands-on problem solving
            </p>
            {/* <div className="flex items-center justify-center gap-2 text-theme-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-gray-300">4.9/5 from 500+ students</span>
            </div> */}
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)] overflow-hidden">
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Complete Challenge Package
                  </h2>
                  <p className="text-gray-300">
                    Get lifetime access to all challenges and solutions
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {features.map((feature) => (
                    <div
                      key={feature.title}
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-theme-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {feature.title}
                        </p>
                        <p className="text-gray-300 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonials */}
                {/* <div className="mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.name}
                        className="p-4 rounded-lg bg-white/5 border border-theme-400/10"
                      >
                        <p className="text-gray-300 mb-4">
                          "{testimonial.text}"
                        </p>
                        <div>
                          <div className="text-white font-medium">
                            {testimonial.name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {testimonial.role} at {testimonial.company}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Guarantee */}
                <div className="text-center mb-12 p-6 rounded-lg border border-theme-400/20 bg-white/5">
                  <h3 className="text-white font-bold mb-2">
                    30-Day Money-Back Guarantee
                  </h3>
                  <p className="text-gray-300">
                    Try the challenges risk-free. If you're not completely
                    satisfied, get a full refund within 30 days.
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center space-y-6">
                  <div>
                    <div className="text-gray-400 mb-2">
                      Regular price <span className="line-through">$49.99</span>
                    </div>
                    <div className="text-6xl font-bold text-white mb-2">
                      $20.00
                    </div>
                    <div className="text-theme-400 font-medium">
                      Limited Time Offer
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      One-time payment, lifetime access
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <Button
                      size="lg"
                      onClick={handlePurchase}
                      className="w-full max-w-sm font-semibold bg-theme-400 hover:bg-theme-500 text-black text-lg py-6"
                    >
                      Get Instant Access
                    </Button>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm">
                        Secure payment with Stripe
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
