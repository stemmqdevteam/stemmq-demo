import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  className?: string;
}

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

function Tooltip({ content, position = "top", children, className }: TooltipProps) {
  return (
    <div className={cn("relative group inline-flex", className)}>
      {children}
      <div
        className={cn(
          "absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100",
          "transition-opacity duration-150",
          "px-2.5 py-1.5 text-xs font-medium rounded-md",
          "bg-foreground text-background shadow-lg",
          "whitespace-nowrap",
          positionStyles[position]
        )}
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
}

export { Tooltip };
