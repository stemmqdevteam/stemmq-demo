"use client";

import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

function Dropdown({ trigger, items, align = "right", className }: DropdownProps) {
  return (
    <Menu as="div" className={cn("relative inline-block text-left", className)}>
      <MenuButton as={Fragment}>{trigger}</MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-lg",
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
          )}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="my-1 h-px bg-border" />;
            }
            return (
              <MenuItem key={index}>
                <button
                  onClick={item.onClick}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    "data-[focus]:bg-muted",
                    item.danger
                      ? "text-danger data-[focus]:text-danger"
                      : "text-card-foreground"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </MenuItem>
            );
          })}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

export { Dropdown };
export type { DropdownItem };
