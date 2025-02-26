import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCurrentUser } from "~/utils/session";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { Menu, LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";

export const getUserInfoFn = createServerFn().handler(async () => {
  const user = await getCurrentUser();
  return { user };
});

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = useSuspenseQuery({
    queryKey: ["userInfo"],
    queryFn: () => getUserInfoFn(),
  });

  return (
    <div className="fixed top-0 left-0 right-0 bg-background border-b z-50">
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Mobile Icon */}
          <div className="md:hidden">
            <LayoutGrid className="h-5 w-5" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-12 items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-20 w-20" />
            </Link>

            <Link
              to="/"
              activeProps={{
                className: "font-bold",
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              activeProps={{
                className: "font-bold",
              }}
              activeOptions={{ exact: true }}
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              activeProps={{
                className: "font-bold",
              }}
              activeOptions={{ exact: true }}
            >
              Courses
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {userInfo.data.user ? (
              <a href="/api/logout" className="hidden md:block">
                <Button>Sign Out</Button>
              </a>
            ) : (
              <a href="/api/login/google" className="hidden md:block">
                <Button>Sign In</Button>
              </a>
            )}

            <div className="hidden md:block">
              <ModeToggle />
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
                    <Link
                      to="/dashboard"
                      className="flex items-center py-2 text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/courses"
                      className="flex items-center py-2 text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Courses
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
