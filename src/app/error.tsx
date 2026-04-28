"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-8 w-8 text-danger" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="accent" onClick={reset}>
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
