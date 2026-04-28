import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials: string;
  size?: AvatarSize;
  status?: "online" | "offline" | "away";
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const statusSizeStyles: Record<AvatarSize, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

const statusColors = {
  online: "bg-success",
  offline: "bg-muted-foreground",
  away: "bg-warning",
};

function Avatar({ className, src, initials, size = "md", status, ...props }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={initials}
          className={cn(
            "rounded-full object-cover",
            sizeStyles[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-accent/10 text-accent font-medium",
            sizeStyles[size]
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-background",
            statusSizeStyles[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

export { Avatar };
