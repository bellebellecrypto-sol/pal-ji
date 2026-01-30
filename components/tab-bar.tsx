"use client";

import { cn } from "@/lib/utils";
import {
  Palette,
  Sparkles,
  Eye,
  Blend,
  Heart,
} from "lucide-react";

type Tab =
  | "generate"
  | "explore"
  | "visualizer"
  | "gradient"
  | "saved";

interface TabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  savedCount?: number;
}

const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: "generate", label: "Create", icon: Sparkles },
  { id: "explore", label: "Explore", icon: Palette },
  { id: "visualizer", label: "Preview", icon: Eye },
  { id: "gradient", label: "Gradient", icon: Blend },
  { id: "saved", label: "Saved", icon: Heart },
];

export function TabBar({ activeTab, onTabChange, savedCount = 0 }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 pb-safe backdrop-blur-2xl">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around px-1 py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const showBadge = tab.id === "saved" && savedCount > 0;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "group relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2.5 transition-all duration-200 ease-out",
                  "active:scale-95",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                {/* Active indicator background */}
                <span
                  className={cn(
                    "absolute inset-x-1 inset-y-0.5 rounded-2xl bg-primary/8 transition-all duration-300 ease-out",
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  )}
                />
                
                <span className="relative flex h-6 items-center justify-center">
                  <Icon
                    className={cn(
                      "h-[22px] w-[22px] transition-all duration-200 ease-out",
                      isActive && "scale-105",
                      tab.id === "saved" && isActive && "fill-current"
                    )}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                  {showBadge && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                      {savedCount > 9 ? "9+" : savedCount}
                    </span>
                  )}
                </span>
                
                <span 
                  className={cn(
                    "relative text-[10px] font-medium tracking-wide transition-all duration-200",
                    isActive ? "font-semibold text-primary" : "text-muted-foreground"
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
