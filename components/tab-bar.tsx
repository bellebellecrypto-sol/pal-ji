"use client";

import { cn } from "@/lib/utils";
import {
  Palette,
  Sparkles,
  Eye,
  Blend,
  ImageIcon,
  Contrast,
} from "lucide-react";
import { useHaptics } from "@/hooks/use-native";

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
  const { selection } = useHaptics();

  const handleTabChange = async (tab: Tab) => {
    await selection();
    onTabChange(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 pb-safe backdrop-blur-xl">
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-around py-2 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )}
                />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export type { Tab };
