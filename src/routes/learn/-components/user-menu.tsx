import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Home, LogOut, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "~/hooks/use-auth";
import { useProfile } from "~/hooks/use-profile";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const user = useAuth();
  const { data: profile } = useProfile();

  if (!user) {
    return (
      <div className={className}>
        <div className="p-4 border-t">
          <a href="/api/login/google">
            <Button className="w-full">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="p-4 border-t space-y-3">
        {/* User Info */}
        <div className="flex items-center justify-center gap-3">
          <img
            className="size-10 rounded-full w-auto object-cover"
            src={
              profile?.image ??
              `https://api.dicebear.com/9.x/initials/svg?seed=${profile?.displayName || "user"}&backgroundColor=6366f1&textColor=ffffff`
            }
            alt="Your avatar"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {profile?.displayName}
            </p>
            {user.isPremium && (
              <p className="text-xs text-primary">Premium Member</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <div className="flex flex-col gap-2">
          <Link to="/">
            <Button
              variant="outline"
              className="text-center w-full justify-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <a href="/api/logout" className="block">
            <Button className="w-full justify-center module-card px-4 py-2 flex items-center gap-2 text-sm font-medium text-theme-700 dark:text-theme-300 hover:text-theme-800 dark:hover:text-theme-200 transition-all duration-200 hover:shadow-elevation-3">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
