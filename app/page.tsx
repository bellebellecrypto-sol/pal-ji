"use client";

import { useState, useEffect } from "react";
import { TabBar, type Tab } from "@/components/tab-bar";
import { GenerateView } from "@/components/generate-view";
import { ExploreView } from "@/components/explore-view";
import { VisualizerView } from "@/components/visualizer-view";
import { GradientView } from "@/components/gradient-view";
import { ImageExtractorView } from "@/components/image-extractor-view";
import { type Palette } from "@/lib/colors";
import { useNativeStorage } from "@/hooks/use-native";
import { Settings, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [visualizerPalette, setVisualizerPalette] = useState<Palette | null>(null);
  const storage = useNativeStorage();

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await storage.get("paletta-saved");
        if (stored) {
          setSavedPalettes(JSON.parse(stored));
        }
      } catch {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [storage]);

  // Save palettes when changed
  useEffect(() => {
    if (!isLoading) {
      storage.set("paletta-saved", JSON.stringify(savedPalettes));
    }
  }, [savedPalettes, storage, isLoading]);

  const handleSavePalette = (palette: Palette) => {
    setSavedPalettes((prev) => {
      const exists = prev.some((p) => p.id === palette.id);
      if (exists) {
        return prev.filter((p) => p.id !== palette.id);
      }
      return [...prev, palette];
    });
  };

  const handleClearSaved = () => {
    if (confirm("Are you sure you want to clear all saved palettes?")) {
      setSavedPalettes([]);
    }
  };

  const selectPaletteForVisualizer = () => {
    if (savedPalettes.length > 0) {
      setShowSaved(true);
    }
  };

  const handleSelectForVisualizer = (palette: Palette) => {
    setVisualizerPalette(palette);
    setShowSaved(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Action Buttons */}
      <div className="fixed right-4 top-4 z-50 flex gap-2 pt-safe">
        <button
          onClick={() => setShowSaved(true)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-xl transition-all",
            showSaved
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-xl transition-all",
            showSettings
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Main Views */}
      {activeTab === "generate" && (
        <GenerateView onSave={handleSavePalette} savedPalettes={savedPalettes} />
      )}
      {activeTab === "explore" && (
        <ExploreView onSave={handleSavePalette} savedPalettes={savedPalettes} />
      )}
      {activeTab === "visualizer" && (
        <VisualizerView
          palette={visualizerPalette}
          onSelectPalette={selectPaletteForVisualizer}
        />
      )}
      {activeTab === "gradient" && <GradientView />}
      {activeTab === "extract" && (
        <ImageExtractorView onSave={handleSavePalette} savedPalettes={savedPalettes} />
      )}

      {/* Bottom Sheet: Saved Palettes */}
      {showSaved && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowSaved(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-background pb-safe">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background p-4">
              <h2 className="text-lg font-bold text-foreground">Saved Palettes</h2>
              <button
                onClick={() => setShowSaved(false)}
                className="rounded-full bg-secondary p-2 text-secondary-foreground"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {savedPalettes.length === 0 ? (
                <div className="py-12 text-center">
                  <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No saved palettes yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tap the heart icon on any palette to save it
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedPalettes.map((palette) => (
                    <button
                      key={palette.id}
                      onClick={() =>
                        activeTab === "visualizer"
                          ? handleSelectForVisualizer(palette)
                          : handleSavePalette(palette)
                      }
                      className="w-full overflow-hidden rounded-2xl bg-card text-left shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <div className="flex h-20">
                        {palette.colors.map((color, i) => (
                          <div key={i} className="flex-1" style={{ backgroundColor: color.hex }} />
                        ))}
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <span className="font-medium text-foreground">{palette.name}</span>
                        {activeTab === "visualizer" ? (
                          <span className="text-xs text-primary">Select</span>
                        ) : (
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet: Settings */}
      {showSettings && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-background pb-safe">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background p-4">
              <h2 className="text-lg font-bold text-foreground">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-full bg-secondary p-2 text-secondary-foreground"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {/* Actions */}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Data
                </h3>
                <button
                  onClick={handleClearSaved}
                  disabled={savedPalettes.length === 0}
                  className="w-full rounded-xl bg-destructive/10 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                >
                  Clear All Saved Palettes ({savedPalettes.length})
                </button>
              </div>

              {/* App Info */}
              <div className="mt-8 text-center">
                <p className="text-sm font-medium text-foreground">Paletta</p>
                <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
