"use client";

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  label?: string;
  defaultValue?: string;
  required
}

export function Select({ name, value, onChange, options, placeholder = "Select...", className, label, defaultValue,required }: SelectProps) {
  const selected = options.find(o => o.value === value);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-input bg-card py-2 pl-3 pr-10 text-left text-sm text-foreground shadow-sm hover:border-muted-foreground/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
            <span className={cn(!selected && "text-muted-foreground")}>
              {selected?.label ?? placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-card py-1 text-sm shadow-lg focus:outline-none">
            {options.map(option => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ focus, selected }) =>
                  cn(
                    "relative cursor-pointer select-none py-2 pl-3 pr-10 transition-colors",
                    focus && "bg-muted",
                    selected && "text-accent font-medium"
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span>{option.label}</span>
                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-accent">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
