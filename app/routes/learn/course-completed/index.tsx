import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { useState, useEffect } from "react";
import { useWindowSize } from "~/hooks/use-window-size";
import Confetti from "react-confetti";
import { Twitter, Github, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/learn/course-completed/")({
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Confetti width={width} height={height} numberOfPieces={confettiPieces} />
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-12">
        <div className="text-center space-y-6">
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
          <h1 className="text-4xl font-bold">Congratulations! 🎉</h1>
          <p className="text-xl text-muted-foreground">
            You've completed the course! We hope you learned a lot and enjoyed
            the experience.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-muted-foreground">
            Have questions or feedback? Feel free to reach out to me at{" "}
            <a
              href="mailto:webdevcody@gmail.com"
              className="text-primary hover:underline"
            >
              webdevcody@gmail.com
            </a>
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold">Stay Updated</h2>
            <p className="text-muted-foreground">
              Sign up for our newsletter to get notified about new courses,
              updates, and exclusive content.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Subscribe to Newsletter
              </Button>
            </form>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold">Connect With Me</h2>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <a
                  href="https://twitter.com/webdevcody"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/webdevcody"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
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
    </div>
  );
}
