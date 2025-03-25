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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient similar to homepage */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.05)_0%,transparent_65%)] pointer-events-none" />

      <Confetti width={width} height={height} numberOfPieces={cofettiPieces} />

      <div className="max-w-md w-full relative z-10">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)] p-8">
          <div className="text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-theme-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]"
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
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-300 mb-8">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <Button
              asChild
              disabled={isLoading || !firstSegment?.slug}
              className="w-full bg-theme-400 hover:bg-theme-500 text-black font-semibold"
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
    </div>
  );
}
