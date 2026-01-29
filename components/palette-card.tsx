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
    <div className="overflow-hidden rounded-3xl bg-card shadow-md ring-1 ring-border/50 transition-all duration-200 hover:shadow-lg active:scale-[0.99]">
      <div className="flex h-40">
        {palette.colors.map((color, index) => (
          <button
            key={index}
            onClick={() => copyToClipboard(color.hex, index)}
            className="relative flex-1 transition-all duration-200 ease-out hover:flex-[1.2] active:flex-[1.15]"
            style={{ backgroundColor: color.hex }}
          >
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                copiedIndex === index ? "opacity-100" : "opacity-0"
              )}
              style={{ color: getContrastColor(color.hex) }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <Check className="h-5 w-5" />
                <span className="text-[10px] font-semibold">Copied</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{palette.name}</h3>
          <button
            onClick={handleLike}
            className={cn(
              "rounded-xl p-2 transition-all duration-200 active:scale-90",
              liked ? "text-rose-500" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Heart className={cn("h-[18px] w-[18px]", liked && "fill-current")} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {palette.colors.map((color, index) => (
            <button
              key={index}
              onClick={() => copyToClipboard(color.hex, index)}
              className="flex items-center gap-1.5 rounded-lg bg-secondary/70 px-2 py-1 text-[11px] font-medium text-secondary-foreground transition-all duration-200 hover:bg-secondary"
            >
              <span
                className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: color.hex }}
              />
              <span className="font-mono uppercase">{color.hex.replace("#", "")}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
