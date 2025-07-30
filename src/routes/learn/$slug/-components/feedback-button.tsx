import { Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";

export function FloatingFeedbackButton() {
  return (
    <Link to="/create-testimonial" className="fixed bottom-6 right-6 z-50">
      <Button
        size="lg"
        className="mt-4 module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        Leave a Testimonial
      </Button>
    </Link>
  );
}
