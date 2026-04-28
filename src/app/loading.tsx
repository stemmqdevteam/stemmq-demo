import { Brain } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute inset-0 rounded-lg gradient-bg animate-pulse" />
          <Brain className="h-4 w-4 text-white" />
        </div>
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
