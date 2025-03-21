import { createFileRoute } from "@tanstack/react-router";
import { useFirstSegment } from "~/hooks/use-first-segment";
import Confetti from "react-confetti";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useWindowSize } from "~/hooks/use-window-size";

export const Route = createFileRoute("/success")({ component: RouteComponent });

function RouteComponent() {
  const [cofettiPieces, setCofettiPieces] = useState(100);

  const { data: firstSegment, isLoading } = useFirstSegment();
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCofettiPieces(0);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Confetti width={width} height={height} numberOfPieces={cofettiPieces} />
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <Button
            asChild
            disabled={isLoading || !firstSegment?.slug}
            className="w-full"
          >
            {isLoading || !firstSegment ? (
              "Loading..."
            ) : (
              <a href={`/learn/${firstSegment.slug}`}>Start Learning</a>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
