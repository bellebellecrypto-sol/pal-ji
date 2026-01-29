"use client";

import { cn } from "@/lib/utils";
import {
  Palette,
  Sparkles,
  Eye,
  Blend,
  Contrast,
} from "lucide-react";

type Tab =
  | "generate"
  | "explore"
  | "visualizer"
  | "gradient"
  | "extract"
  | "contrast";

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: "generate", label: "Create", icon: Sparkles },
  { id: "explore", label: "Explore", icon: Palette },
  { id: "visualizer", label: "Preview", icon: Eye },
  { id: "gradient", label: "Gradient", icon: Blend },
  { id: "contrast", label: "Contrast", icon: Contrast },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const handleTabChange = (tab: Tab) => {
    onTabChange(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 pb-safe backdrop-blur-2xl">
      <div className="mx-auto max-w-lg px-2">
        <div className="flex items-center justify-around py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-300 ease-out",
                  "active:scale-90",
                  isActive 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground/70"
                )}
              >
                {/* Active indicator pill */}
                <span
                  className={cn(
                    "absolute inset-0 rounded-xl bg-primary/10 transition-all duration-300 ease-out",
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  )}
                />
                
                <span className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300 ease-out",
                      isActive 
                        ? "scale-110 text-primary" 
                        : "group-hover:scale-105"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </span>
                
                <span 
                  className={cn(
                    "relative text-[10px] font-semibold tracking-wide transition-all duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export type { Tab };
