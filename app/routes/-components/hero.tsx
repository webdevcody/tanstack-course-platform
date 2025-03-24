import { Button } from "~/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useContinueSlug } from "~/hooks/use-continue-slug";

export function HeroSection() {
  const continueSlug = useContinueSlug();

  return (
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-5xl sm:text-6xl font-bold mb-8"
        >
          Practice Learning React
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Master React through hands-on practice with 20 engaging challenges.
          From building a Connect Four game to crafting a Quote Generator,
          you'll learn to solve real-world React problems by breaking them down
          into manageable pieces.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/purchase">
            <Button size="lg" className="w-full sm:w-auto px-8">
              Buy Now
            </Button>
          </Link>
          <Link to={"/learn/$slug"} params={{ slug: continueSlug }}>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 rounded-md"
            >
              Continue Learning
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
