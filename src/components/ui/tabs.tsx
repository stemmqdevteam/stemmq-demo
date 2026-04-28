"use client";

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
  variant?: "underline" | "pill";
  className?: string;
}

function Tabs({ tabs, variant = "underline", className }: TabsProps) {
  return (
    <TabGroup className={className}>
      <TabList
        className={cn(
          "flex gap-1",
          variant === "underline" && "border-b border-border gap-0"
        )}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className={cn(
              "text-sm font-medium transition-all duration-150 outline-none cursor-pointer",
              variant === "underline" &&
                "px-4 py-2.5 -mb-px border-b-2 border-transparent text-muted-foreground data-[selected]:border-accent data-[selected]:text-foreground hover:text-foreground",
              variant === "pill" &&
                "px-3 py-1.5 rounded-lg text-muted-foreground data-[selected]:bg-muted data-[selected]:text-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="mt-4">
        {tabs.map((tab) => (
          <TabPanel key={tab.label}>{tab.content}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}

export { Tabs };
