import * as React from "react";
import { cn } from "./utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-black/10 dark:shadow-white/10": variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-black/10 dark:shadow-white/10": variant === "secondary",
            "border border-border bg-transparent hover:bg-foreground/10 text-foreground": variant === "outline",
            "hover:bg-foreground/10 text-foreground": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25": variant === "danger",
            "h-9 px-4 text-sm": size === "sm",
            "h-12 w-full max-w-[300px]": size === "lg",
            "min-h-[44px] px-6 py-2": size === "md",
          },
          className
        )}
        disabled={isLoading || props.disabled}
        {...(props as any)}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
