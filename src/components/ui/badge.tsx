import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral";
type IntentVariant = "Growth" | "Defense" | "Efficiency" | "Experiment" | "Risk Mitigation";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  intent?: IntentVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-accent/10 text-accent border-accent/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  info: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

const intentStyles: Record<IntentVariant, string> = {
  Growth: "bg-success/10 text-success border-success/20",
  Defense: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20",
  Efficiency: "bg-accent/10 text-accent border-accent/20",
  Experiment: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "Risk Mitigation": "bg-warning/10 text-warning border-warning/20",
};

function Badge({ className, variant = "default", intent, ...props }: BadgeProps) {
  const styles = intent ? intentStyles[intent] : variantStyles[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        styles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
export type { BadgeVariant, IntentVariant };
