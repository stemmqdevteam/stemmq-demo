import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations/fade-in";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

function SectionHeader({ eyebrow, title, subtitle, align = "center", className }: SectionHeaderProps) {
  return (
    <FadeIn direction="up">
      <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </span>
        )}
        <h2
          className={cn(
            "font-bold tracking-tight text-foreground",
            eyebrow ? "mt-2" : "",
            "text-3xl sm:text-4xl"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-4 text-muted-foreground leading-relaxed",
              align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl",
              "text-base sm:text-lg"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </FadeIn>
  );
}

export { SectionHeader };
