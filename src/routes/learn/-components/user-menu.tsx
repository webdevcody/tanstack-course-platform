import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Home, LogOut, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "~/hooks/use-auth";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const user = useAuth();

  if (!user) {
    return (
      <div className={className}>
        <div className="p-4 border-t">
          <a href="/api/login/google">
            <Button variant="outline" className="w-full">
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.email}</p>
            {user.isPremium && (
              <p className="text-xs text-primary">Premium Member</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <div className="space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <a href="/api/logout" className="block">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
