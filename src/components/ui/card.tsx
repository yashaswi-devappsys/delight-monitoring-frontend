import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

const Card = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="card"
    className={cn(
      "flex flex-col gap-4 rounded-xl border border-border bg-card py-4 text-card-foreground shadow-sm sm:gap-5 sm:py-5 lg:gap-6 lg:py-6",
      className,
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="card-header"
    className={cn("grid gap-1 px-4 sm:gap-1.5 sm:px-5 lg:px-6", className)}
    {...props}
  />
);

const CardTitle = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="card-title"
    className={cn("text-sm font-semibold leading-none tracking-tight sm:text-base", className)}
    {...props}
  />
);

const CardDescription = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="card-description"
    className={cn("text-xs leading-relaxed text-muted-foreground sm:text-sm", className)}
    {...props}
  />
);

const CardContent = ({ className, ...props }: ComponentProps<"div">) => (
  <div data-slot="card-content" className={cn("px-4 sm:px-5 lg:px-6", className)} {...props} />
);

const CardFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="card-footer"
    className={cn("flex items-center px-4 sm:px-5 lg:px-6", className)}
    {...props}
  />
);

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
