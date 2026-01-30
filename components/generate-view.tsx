"use client";

import { cn } from "@/lib/utils";

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
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            Choose Category
          </h2>
          <UseCaseSelector selectedUseCase={selectedUseCase} onSelect={setSelectedUseCase} />
        </section>

        <section className="mb-6">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full rounded-2xl py-5 text-[15px] font-semibold shadow-sm transition-transform duration-150 active:scale-[0.98] disabled:opacity-70"
          >
            <RefreshCw
              className={cn("mr-2 h-5 w-5", isGenerating && "animate-spin")}
            />
            {isGenerating ? "Generating..." : "Generate Palette"}
          </Button>
        </section>

        {currentPalette && (
          <section className="animate-fade-up">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              Your Palette
            </h2>
            <div className="relative">
              <EditablePalette
                palette={currentPalette}
                useCase={selectedUseCase}
                onSave={onSave}
                onPaletteChange={handlePaletteChange}
                isSaved={isPaletteSaved(currentPalette)}
              />
              {/* Loading overlay while regenerating */}
              {isGenerating && (
                <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px]" />
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              )}
            </div>
          </section>
        )}

        {!currentPalette && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-5xl text-primary/50">✦</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Ready to create?</h3>
            <p className="mb-6 max-w-[260px] text-sm leading-relaxed text-muted-foreground">
              Choose a category above, then tap Generate to create your perfect color palette
            </p>
            <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-xs text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">1</span>
              <span>Pick category</span>
              <span className="text-border">→</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">2</span>
              <span>Generate</span>
              <span className="text-border">→</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">3</span>
              <span>Save</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
