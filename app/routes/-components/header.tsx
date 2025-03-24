import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
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
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const isActive = pathname.startsWith("/learn");

  return (
    <div className="fixed top-0 left-0 right-0 bg-black border-b z-50">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8"
              >
                <path d="M11.103 0c3.962 0 7.103 3.141 7.103 7.103 0 1.938-.77 3.705-2.023 5.005l5.52 5.521a1 1 0 0 1-1.414 1.414l-5.52-5.52a7.073 7.073 0 0 1-5.006 2.023C3.14 15.546 0 12.405 0 8.443 0 4.48 3.14 1.34 7.103 1.34c1.938 0 3.705.77 5.005 2.023l5.521-5.52a1 1 0 0 1 1.414 1.414l-5.52 5.52A7.073 7.073 0 0 1 11.103 0zm0 2a5.103 5.103 0 1 0 0 10.206 5.103 5.103 0 0 0 0-10.206z" />
              </svg>
              <span className="font-semibold text-lg">React Mastery</span>
            </Link>
            <Link
              to="/"
              className="hidden md:flex text-foreground/70 hover:text-foreground transition-colors ml-4"
              activeProps={{ className: "font-bold text-foreground" }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to="/learn/$slug"
              params={{ slug: continueSlug }}
              className={cn(
                "hidden md:flex transition-colors ml-4",
                isActive
                  ? "font-bold text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              )}
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
