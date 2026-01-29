"use client";

import { useState, useEffect } from "react";
import { type Palette, type Color, getContrastColor, generatePalette, type UseCase } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Check, Copy, Heart, Lock, RefreshCw, Share2, Download } from "lucide-react";
import { useHaptics, useClipboard, useShare } from "@/hooks/use-native";
import { ColorEditor } from "./color-editor";
import { ExportModal } from "./export-modal";
import { useToast } from "./toast";

interface EditablePaletteProps {
  palette: Palette;
  useCase: UseCase;
  onSave?: (palette: Palette) => void;
  onPaletteChange?: (palette: Palette) => void;
  isSaved?: boolean;
}

export function EditablePalette({
  palette,
  useCase,
  onSave,
  onPaletteChange,
  isSaved = false,
}: EditablePaletteProps) {
  const [currentPalette, setCurrentPalette] = useState(palette);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [liked, setLiked] = useState(isSaved);
  const [lockedColors, setLockedColors] = useState<boolean[]>([false, false, false, false, false]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showExport, setShowExport] = useState(false);
  
  const { impact, notification, selection } = useHaptics();
  const { copy } = useClipboard();
  const { share, canShare } = useShare();
  const { showToast } = useToast();

  useEffect(() => {
    setCurrentPalette(palette);
    setLiked(isSaved);
  }, [palette, isSaved]);

  const copyToClipboard = async (hex: string, index: number) => {
    const success = await copy(hex);
    if (success) {
      await impact("light");
      setCopiedIndex(index);
      showToast(`Copied ${hex}`, "success");
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const copyAllColors = async () => {
    const allHex = currentPalette.colors.map((c) => c.hex).join(", ");
    const success = await copy(allHex);
    if (success) {
      await impact("medium");
      showToast("All colors copied!", "success");
    }
  };

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    await notification(newLiked ? "success" : "warning");
    showToast(newLiked ? "Palette saved!" : "Palette removed", newLiked ? "success" : "info");
    if (onSave) {
      onSave(currentPalette);
    }
  };

  const handleShare = async () => {
    await impact("light");
    const text = `Check out this palette: ${currentPalette.name}\n${currentPalette.colors.map((c) => c.hex).join(" ")}`;
    if (canShare) {
      await share({ title: currentPalette.name, text });
    } else {
      await copy(text);
      showToast("Palette copied to clipboard!", "success");
    }
  };

  const toggleLock = async (index: number) => {
    await selection();
    setLockedColors((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
    showToast(lockedColors[index] ? "Color unlocked" : "Color locked", "info");
  };

  const handleColorChange = (index: number, newHex: string) => {
    const newColors = [...currentPalette.colors];
    newColors[index] = { ...newColors[index], hex: newHex };
    const newPalette = { ...currentPalette, colors: newColors };
    setCurrentPalette(newPalette);
    onPaletteChange?.(newPalette);
    showToast("Color updated", "success");
  };

  const regenerateUnlocked = async () => {
    setIsRegenerating(true);
    await impact("medium");
    
    setTimeout(() => {
      const newPalette = generatePalette(useCase);
      const mergedColors = currentPalette.colors.map((color, i) =>
        lockedColors[i] ? color : newPalette.colors[i]
      );
      const updatedPalette = {
        ...newPalette,
        id: currentPalette.id,
        colors: mergedColors,
      };
      setCurrentPalette(updatedPalette);
      onPaletteChange?.(updatedPalette);
      setIsRegenerating(false);
      
      const lockedCount = lockedColors.filter(Boolean).length;
      if (lockedCount > 0) {
        showToast(`Regenerated ${5 - lockedCount} colors`, "success");
      } else {
        showToast("Palette regenerated!", "success");
      }
    }, 300);
  };

  return (
    <>
      <div className="overflow-hidden rounded-3xl bg-card shadow-lg">
        {/* Color swatches */}
        <div className="flex h-48">
          {currentPalette.colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setEditingIndex(index)}
              className="relative flex-1 transition-all duration-200 hover:flex-[1.3] active:flex-[1.2]"
              style={{ backgroundColor: color.hex }}
            >
              {/* Lock indicator */}
              {lockedColors[index] && (
                <div
                  className="absolute left-1/2 top-3 -translate-x-1/2"
                  style={{ color: getContrastColor(color.hex) }}
                >
                  <Lock className="h-4 w-4" />
                </div>
              )}

              {/* Copied indicator */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200",
                  copiedIndex === index && "opacity-100"
                )}
                style={{ color: getContrastColor(color.hex) }}
              >
                <div className="flex flex-col items-center gap-1">
                  <Check className="h-5 w-5" />
                  <span className="text-xs font-medium">Copied!</span>
                </div>
              </div>

              {/* Tap to edit hint */}
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium opacity-50"
                style={{ color: getContrastColor(color.hex) }}
              >
                Edit
              </div>
            </button>
          ))}
        </div>

        {/* Info and actions */}
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{currentPalette.name}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={regenerateUnlocked}
                disabled={isRegenerating}
                className="rounded-full p-2 text-muted-foreground transition-all hover:text-foreground active:scale-90"
              >
                <RefreshCw className={cn("h-5 w-5", isRegenerating && "animate-spin")} />
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="rounded-full p-2 text-muted-foreground transition-all hover:text-foreground active:scale-90"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleShare}
                className="rounded-full p-2 text-muted-foreground transition-all hover:text-foreground active:scale-90"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={handleLike}
                className={cn(
                  "rounded-full p-2 transition-all active:scale-90",
                  liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Heart className={cn("h-5 w-5", liked && "fill-current")} />
              </button>
            </div>
          </div>

          {/* Color chips */}
          <div className="flex flex-wrap gap-2">
            {currentPalette.colors.map((color, index) => (
              <button
                key={index}
                onClick={() => copyToClipboard(color.hex, index)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                  lockedColors[index]
                    ? "bg-amber-100 text-amber-700"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                )}
              >
                {lockedColors[index] && <Lock className="h-2.5 w-2.5" />}
                <span
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="uppercase">{color.hex.replace("#", "")}</span>
              </button>
            ))}
          </div>

          {/* Copy all button */}
          <button
            onClick={copyAllColors}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            <Copy className="h-4 w-4" />
            Copy All Colors
          </button>
        </div>
      </div>

      {/* Color Editor Modal */}
      {editingIndex !== null && (
        <ColorEditor
          color={currentPalette.colors[editingIndex]}
          index={editingIndex}
          isLocked={lockedColors[editingIndex]}
          onColorChange={handleColorChange}
          onLockToggle={toggleLock}
          onClose={() => setEditingIndex(null)}
        />
      )}

      {/* Export Modal */}
      {showExport && (
        <ExportModal palette={currentPalette} onClose={() => setShowExport(false)} />
      )}
    </>
  );
}
