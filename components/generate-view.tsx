"use client";

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
      <IosHeader title="Paletta" subtitle="Generate beautiful palettes" />

      <main className="mx-auto max-w-lg px-6 pt-24">
        <section className="mb-8">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Choose Use Case
          </h2>
          <UseCaseSelector selectedUseCase={selectedUseCase} onSelect={setSelectedUseCase} />
        </section>

        <section className="mb-8">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full rounded-2xl py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
          >
            <RefreshCw
              className={`mr-2 h-5 w-5 ${isGenerating ? "animate-spin" : ""}`}
            />
            {isGenerating ? "Generating..." : "Generate Palette"}
          </Button>
        </section>

        {currentPalette && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl opacity-20">✦</div>
            <p className="text-muted-foreground">
              Select a use case and tap Generate to create your palette
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
