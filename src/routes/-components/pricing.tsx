import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useEffect, useRef } from "react";

export function PricingSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };

    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative py-24 px-6 min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-theme-950 via-gray-900 to-black"></div>

      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-500/50 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[2px] blur-sm bg-gradient-to-r from-transparent via-theme-400/50 to-transparent"></div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-500/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] blur-sm bg-gradient-to-r from-transparent via-theme-400/50 to-transparent"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-bold mb-12 text-white">
          Learn React Through{" "}
          <span className="text-theme-400">Problem Solving</span>
        </h2>
        <div ref={cardRef} className="relative max-w-lg mx-auto">
          <div className="relative bg-[#111111] p-10 rounded-2xl overflow-hidden border border-theme-400/10">
            <div className="absolute inset-0 rounded-2xl transition-opacity duration-300 [background:radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(74,222,128,0.1)_0%,rgba(74,222,128,0.05)_35%,transparent_60%)]"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-theme-400">
                20 Beginner React Challenges
              </h3>
              <div className="text-6xl font-bold mb-8 text-white">
                $20
                <span className="text-lg text-gray-400 font-normal">
                  /lifetime access
                </span>
              </div>
              <ul className="text-left space-y-6 mb-10">
                <li className="flex items-center text-gray-300 group">
                  <svg
                    className="w-6 h-6 mr-3 text-theme-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="group-hover:text-theme-400 transition-colors">
                    Step-by-step problem-solving approach with whiteboarding
                  </span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <svg
                    className="w-6 h-6 mr-3 text-theme-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="group-hover:text-theme-400 transition-colors">
                    Master React fundamentals through hands-on practice
                  </span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <svg
                    className="w-6 h-6 mr-3 text-theme-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="group-hover:text-theme-400 transition-colors">
                    Complete solution code with detailed explanations
                  </span>
                </li>
                <li className="flex items-center text-gray-300 group">
                  <svg
                    className="w-6 h-6 mr-3 text-theme-400 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span className="group-hover:text-theme-400 transition-colors">
                    Access to Discord community for support and discussion
                  </span>
                </li>
              </ul>
              <Link to="/purchase" className="block">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-theme-400 hover:bg-theme-500 text-black transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                >
                  Buy Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
