import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCurrentUser } from "~/utils/session";
import { Button } from "../../components/ui/button";
import { ModeToggle } from "../../components/ModeToggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { useState } from "react";
import { useContinueSlug } from "~/hooks/use-continue-slug";
import { cn } from "~/lib/utils";

export const getUserInfoFn = createServerFn().handler(async () => {
  const user = await getCurrentUser();
  return { user };
});

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const continueSlug = useContinueSlug();
  const userInfo = useSuspenseQuery({
    queryKey: ["userInfo"],
    queryFn: () => getUserInfoFn(),
  });

  return (
    <div className="fixed top-0 left-0 right-0 bg-black border-b z-50">
      <div className="mx-auto container">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/icon.png"
                alt="Beginner React Challenges"
                className="size-12"
              />
              <span className="font-semibold text-sm">
                The 20 React
                <br />
                Challenges Course
              </span>
            </Link>
            <Link
              to="/"
              className={cn(
                "hidden md:flex transition-colors ml-4",
                "text-foreground/70 hover:text-foreground"
              )}
              activeProps={{ className: "font-bold text-theme-500" }}
            >
              Home
            </Link>
            <Link
              to="/purchase"
              className={cn(
                "hidden md:flex transition-colors ml-4",
                "text-foreground/70 hover:text-foreground"
              )}
              activeProps={{ className: "font-bold text-theme-500" }}
            >
              Pricing
            </Link>
            <Link
              to="/learn/$slug"
              params={{ slug: continueSlug }}
              className={cn(
                "hidden md:flex transition-colors ml-4",
                "text-foreground/70 hover:text-foreground"
              )}
              activeProps={{ className: "font-bold text-theme-500" }}
            >
              Course Content
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-4">
              {userInfo.data.user ? (
                <a href="/api/logout">
                  <Button
                    variant="outline"
                    className="border-primary hover:bg-primary/10"
                  >
                    Logout
                  </Button>
                </a>
              ) : (
                <a href="/api/login/google">
                  <Button
                    variant="outline"
                    className="border-primary hover:bg-primary/10"
                  >
                    Login
                  </Button>
                </a>
              )}
              <Link to="/purchase">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Buy Now
                </Button>
              </Link>
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4">
                  <Link
                    to="/"
                    className="flex items-center py-2 text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  {userInfo.data.user ? (
                    <a href="/api/logout" className="py-2 text-lg">
                      Logout
                    </a>
                  ) : (
                    <a href="/api/login/google" className="py-2 text-lg">
                      Login
                    </a>
                  )}
                  <Link to="/purchase">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Buy Now
                    </Button>
                  </Link>
                  <div className="pt-2">
                    <ModeToggle />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}
