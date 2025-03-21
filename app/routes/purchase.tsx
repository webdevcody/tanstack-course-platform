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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Check } from "lucide-react";

export const Route = createFileRoute("/purchase")({
  component: RouteComponent,
});

const checkoutFn = createServerFn()
  .middleware([authenticatedMiddleware])
  .handler(async ({ context }) => {
    console.log("env.STRIPE_PRICE_ID", env.STRIPE_PRICE_ID);
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
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please login to access the full course content and make a purchase
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <a href="/api/login/google">
              <Button size="lg" className="font-semibold">
                Login with Google
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">React Mastery Course</h1>
          <p className="text-xl text-muted-foreground">
            Take your React skills to the next level
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Complete Package
            </CardTitle>
            <CardDescription>
              Get lifetime access to all course content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-6">
                {[
                  "40+ hours of video content",
                  "Hands-on projects and exercises",
                  "Private Discord community access",
                  "Certificate of completion",
                  "Source code for all projects",
                  "Lifetime updates",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold">$20.00</div>
              <div className="text-sm text-muted-foreground mt-1">
                One-time payment, lifetime access
              </div>
            </div>
            <Button
              size="lg"
              onClick={handlePurchase}
              className="w-full max-w-sm font-semibold"
            >
              Purchase Now
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
