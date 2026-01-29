"use client";

import { useState, useEffect } from "react";
import { type Palette, getContrastColor } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Check, Copy, Heart } from "lucide-react";
import { useHaptics, useClipboard } from "@/hooks/use-native";

interface PaletteCardProps {
  palette: Palette;
  onSave?: (palette: Palette) => void;
  isSaved?: boolean;
}

export function PaletteCard({ palette, onSave, isSaved = false }: PaletteCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [liked, setLiked] = useState(isSaved);
  const { impact, notification } = useHaptics();
  const { copy } = useClipboard();

  useEffect(() => {
    setLiked(isSaved);
  }, [isSaved]);

  const copyToClipboard = async (hex: string, index: number) => {
    const success = await copy(hex);
    if (success) {
      await impact("light");
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    await notification(newLiked ? "success" : "warning");
    if (onSave) {
      onSave(palette);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-lg transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex h-48">
        {palette.colors.map((color, index) => (
          <button
            key={index}
            onClick={() => copyToClipboard(color.hex, index)}
            className="relative flex-1 transition-all duration-200 hover:flex-[1.3] active:flex-[1.2]"
            style={{ backgroundColor: color.hex }}
          >
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
            <div
              className={cn(
                "absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:opacity-100",
                "hover:opacity-100"
              )}
              style={{ color: getContrastColor(color.hex) }}
            >
              <Copy className="h-4 w-4" />
            </div>
          </button>
        ))}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{palette.name}</h3>
          <button
            onClick={handleLike}
            className={cn(
              "rounded-full p-2 transition-all duration-200 active:scale-90",
              liked ? "text-red-500" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-current")} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {palette.colors.map((color, index) => (
            <button
              key={index}
              onClick={() => copyToClipboard(color.hex, index)}
              className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
            >
              <span
                className="h-3 w-3 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
              />
              <span className="uppercase">{color.hex.replace("#", "")}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
