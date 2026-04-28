"use client";

import { Switch as HeadlessSwitch } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled }: SwitchProps) {
  return (
    <HeadlessSwitch.Group>
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div className="flex-1 mr-4">
            {label && (
              <HeadlessSwitch.Label className="text-sm font-medium text-foreground cursor-pointer">
                {label}
              </HeadlessSwitch.Label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        )}
        <HeadlessSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            checked ? "bg-accent" : "bg-muted",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
              checked ? "translate-x-4" : "translate-x-0"
            )}
          />
        </HeadlessSwitch>
      </div>
    </HeadlessSwitch.Group>
  );
}
