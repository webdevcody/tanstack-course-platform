import { useRouter } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function AddSegmentHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="outline" onClick={() => router.history.back()}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Course
      </Button>
    </div>
  );
}
