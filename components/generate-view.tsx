"use client";

import { cn } from "@/lib/utils"

import { useState } from "react";
import { generatePalette, type Palette, type UseCase } from "@/lib/colors";
import { UseCaseSelector } from "./use-case-selector";
import { EditablePalette } from "./editable-palette";
import { IosHeader } from "./ios-header";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useHaptics } from "@/hooks/use-native";

interface GenerateViewProps {
  onSave: (palette: Palette) => void;
  savedPalettes: Palette[];
}

export function GenerateView({ onSave, savedPalettes }: GenerateViewProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>("branding");
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { impact } = useHaptics();

  const handleGenerate = async () => {
    setIsGenerating(true);
    await impact("medium");
    setTimeout(() => {
      const palette = generatePalette(selectedUseCase);
      setCurrentPalette(palette);
      setIsGenerating(false);
    }, 300);
  };

  const isPaletteSaved = (palette: Palette) => {
    return savedPalettes.some((p) => p.id === palette.id);
  };

  const handlePaletteChange = (updatedPalette: Palette) => {
    setCurrentPalette(updatedPalette);
  };

  return (
    <div className="min-h-screen pb-28">
      <IosHeader title="pal" subtitle="Generate beautiful palettes" />

      <main className="mx-auto max-w-lg px-5 pt-24">
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            Choose Category
          </h2>
          <UseCaseSelector selectedUseCase={selectedUseCase} onSelect={setSelectedUseCase} />
        </section>

        <section className="mb-6">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full rounded-2xl py-5 text-[15px] font-semibold shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            <RefreshCw
              className={cn("mr-2 h-5 w-5", isGenerating && "animate-spin")}
            />
            {isGenerating ? "Generating..." : "Generate Palette"}
          </Button>
        </section>

        {currentPalette && (
          <section className="animate-fade-up">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              Your Palette
            </h2>
            <EditablePalette
              palette={currentPalette}
              useCase={selectedUseCase}
              onSave={onSave}
              onPaletteChange={handlePaletteChange}
              isSaved={isPaletteSaved(currentPalette)}
            />
          </section>
        )}

        {!currentPalette && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/5">
              <span className="text-4xl text-primary/40">✦</span>
            </div>
            <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground">
              Select a category and tap Generate to create your palette
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
