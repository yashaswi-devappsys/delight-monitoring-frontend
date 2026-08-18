import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

const Label = ({ className, ...props }: ComponentProps<"label">) => (
  <label
    data-slot="label"
    className={cn(
      "text-xs font-medium leading-none text-foreground sm:text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    {...props}
  />
);

export { Label };
