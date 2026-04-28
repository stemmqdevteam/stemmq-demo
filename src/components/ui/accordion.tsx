"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("divide-y divide-border rounded-xl border", className)}>
      {items.map((item, i) => (
        <Disclosure key={i}>
          {({ open }) => (
            <div>
              <DisclosureButton className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                <span>{item.title}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              </DisclosureButton>
              <AnimatePresence initial={false}>
                {open && (
                  <DisclosurePanel static>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </div>
                    </motion.div>
                  </DisclosurePanel>
                )}
              </AnimatePresence>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
