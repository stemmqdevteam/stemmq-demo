import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "circle" | "card";
}

function Skeleton({ className, variant = "line", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer rounded-md bg-muted",
        variant === "line" && "h-4 w-full",
        variant === "circle" && "h-10 w-10 rounded-full",
        variant === "card" && "h-32 w-full rounded-xl",
        className
      )}
      {...props}
    />
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonTable };
