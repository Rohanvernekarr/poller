import * as React from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-foreground/50",
          "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "text-[#000000] dark:text-[#ffffff]", // Absolute HEX fallbacks for debugging transparency/inheritance issues
          error && "border-red-500 focus-visible:ring-red-500 text-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
