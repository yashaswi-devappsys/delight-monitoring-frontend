import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

const Avatar = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="avatar"
    className={cn("relative flex size-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
);

const AvatarImage = ({ className, alt = "", ...props }: ComponentProps<"img">) => (
  <img
    data-slot="avatar-image"
    alt={alt}
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
);

const AvatarFallback = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    data-slot="avatar-fallback"
    className={cn(
      "flex size-full items-center justify-center rounded-[inherit] bg-muted text-sm font-medium text-muted-foreground",
      className,
    )}
    {...props}
  />
);

export { Avatar, AvatarFallback, AvatarImage };
