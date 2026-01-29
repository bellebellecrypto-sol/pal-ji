"use client";

import { useEffect, useState, useMemo } from "react";
import {
  generatePalette,
  useCases,
  premadePalettes,
  type Palette,
  type UseCase,
} from "@/lib/colors";
import { PaletteCard } from "./palette-card";
import { IosHeader } from "./ios-header";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-native";

interface ExploreViewProps {
  onSave: (palette: Palette) => void;
  savedPalettes: Palette[];
}

export function ExploreView({ onSave, savedPalettes }: ExploreViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<UseCase | "all" | "curated">("curated");
  const [generatedPalettes, setGeneratedPalettes] = useState<Palette[]>([]);
  const { selection } = useHaptics();

  useEffect(() => {
    const palettes: Palette[] = [];
    useCases.forEach((useCase) => {
      for (let i = 0; i < 2; i++) {
        palettes.push(generatePalette(useCase.id));
      }
    });
    setGeneratedPalettes(palettes);
  }, []);

  const handleCategoryChange = async (category: UseCase | "all" | "curated") => {
    await selection();
    setSelectedCategory(category);
  };

  const palettes = useMemo(() => {
    if (selectedCategory === "curated") {
      return premadePalettes;
    }
    if (selectedCategory === "all") {
      return [...premadePalettes, ...generatedPalettes];
    }
    return [
      ...premadePalettes.filter((p) => p.category === selectedCategory),
      ...generatedPalettes.filter((p) => p.category === selectedCategory),
    ];
  }, [selectedCategory, generatedPalettes]);

  const isPaletteSaved = (palette: Palette) => {
    return savedPalettes.some((p) => p.id === palette.id);
  };

  return (
    <div className="min-h-screen pb-28">
      <IosHeader title="Explore" subtitle="Discover trending palettes" />

      <main className="mx-auto max-w-lg px-6 pt-24">
        <div className="-mx-6 mb-6 overflow-x-auto px-6">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => handleCategoryChange("curated")}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                selectedCategory === "curated"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              )}
            >
              Curated
            </button>
            <button
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              )}
            >
              All
            </button>
            {useCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => handleCategoryChange(useCase.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  selectedCategory === useCase.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                )}
              >
                {useCase.icon} {useCase.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {palettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              onSave={onSave}
              isSaved={isPaletteSaved(palette)}
            />
          ))}
        </div>

        {palettes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl opacity-20">◐</div>
            <p className="text-muted-foreground">No palettes found in this category</p>
          </div>
        )}
      </main>
    </div>
  );
}
