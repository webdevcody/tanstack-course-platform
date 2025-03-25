import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";
import { useState, useEffect } from "react";
import { useWindowSize } from "~/hooks/use-window-size";
import Confetti from "react-confetti";
import { Twitter, Github, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/learn/course-completed")({
  component: CourseCompleted,
});

function CourseCompleted() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [confettiPieces, setConfettiPieces] = useState(100);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setConfettiPieces(0);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup and contact form submission
    toast({ title: "Thank you!", description: "We'll be in touch soon." });
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient similar to homepage */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.05)_0%,transparent_65%)] pointer-events-none" />

      <Confetti width={width} height={height} numberOfPieces={confettiPieces} />

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        <div className="text-center space-y-6">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-theme-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white">
            Congratulations! <span className="text-theme-400">🎉</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            You've completed the course! We hope you learned a lot and enjoyed
            the experience.
          </p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)] p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white">Get in Touch</h2>
          <p className="text-gray-300">
            Have questions or feedback? Feel free to reach out to me at{" "}
            <a
              href="mailto:webdevcody@gmail.com"
              className="text-theme-400 hover:text-theme-300 transition-colors"
            >
              webdevcody@gmail.com
            </a>
          </p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)] p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white">Stay Updated</h2>
          <p className="text-gray-300">
            Sign up for our newsletter to get notified about new courses,
            updates, and exclusive content.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900/50 border-theme-400/20 focus:border-theme-400 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-theme-400 hover:bg-theme-500 text-black font-semibold"
            >
              Subscribe to Newsletter
            </Button>
          </form>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-theme-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)] p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white">Connect With Me</h2>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              asChild
              className="border-theme-400/20 hover:bg-theme-400 hover:text-black transition-colors"
            >
              <a
                href="https://twitter.com/webdevcody"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-theme-400/20 hover:bg-theme-400 hover:text-black transition-colors"
            >
              <a
                href="https://github.com/webdevcody"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-theme-400/20 hover:bg-theme-400 hover:text-black transition-colors"
            >
              <a
                href="https://discord.gg/webdevcody"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Discord
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
