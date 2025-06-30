import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-theme-500 text-black shadow hover:bg-theme-600 dark:bg-theme-400 dark:hover:bg-theme-500",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
        "destructive-outline":
          "border border-red-500 bg-transparent text-red-500 shadow-sm hover:bg-red-50 hover:text-red-600 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300",
        outline:
          "border border-theme-200 bg-background shadow-sm hover:bg-theme-100 hover:text-theme-700 dark:border-theme-800 dark:hover:bg-theme-950 dark:hover:text-theme-300",
        "gray-outline":
          "border border-gray-200 bg-transparent text-gray-500 shadow-sm hover:bg-gray-50 hover:text-gray-600 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-950/50 dark:hover:text-gray-300",
        secondary:
          "bg-theme-100 text-theme-900 shadow-sm hover:bg-theme-200 dark:bg-theme-800 dark:text-theme-100 dark:hover:bg-theme-700",
        ghost:
          "hover:bg-theme-100 hover:text-theme-900 dark:hover:bg-theme-800 dark:hover:text-theme-100",
        link: "text-theme-500 underline-offset-4 hover:underline dark:text-theme-400",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
