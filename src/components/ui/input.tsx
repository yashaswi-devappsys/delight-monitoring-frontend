import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

const Input = ({ className, type, ...props }: ComponentProps<"input">) => (
  <input
    type={type}
    data-slot="input"
    className={cn(
      "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-base text-foreground shadow-xs outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/15 sm:h-11 sm:px-3.5 sm:text-sm dark:bg-input/20 dark:focus-visible:ring-primary/20",
      className,
    )}
    {...props}
  />
);

export { Input };
