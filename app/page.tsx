"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TabBar, type Tab } from "@/components/tab-bar";
import { GenerateView } from "@/components/generate-view";
import { ExploreView } from "@/components/explore-view";
import { VisualizerView } from "@/components/visualizer-view";
import { GradientView } from "@/components/gradient-view";
import { ContrastChecker } from "@/components/contrast-checker";
import { type Palette } from "@/lib/colors";
import { useNativeStorage } from "@/hooks/use-native";
import { Settings, Heart, Search, X, User, Cloud, CloudOff, LogOut, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToastProvider, useToast } from "@/components/toast";
import { Onboarding } from "@/components/onboarding";
import { SwipeablePaletteCard } from "@/components/swipeable-palette-card";
import { useAuth } from "@/contexts/auth-context";
import { usePaletteSync } from "@/hooks/use-palette-sync";

function HomeContent() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [localPalettes, setLocalPalettes] = useState<Palette[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [visualizerPalette, setVisualizerPalette] = useState<Palette | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const storage = useNativeStorage();
  const { showToast } = useToast();
  const { user, signOut, isLoading: isAuthLoading } = useAuth();
  const { 
    palettes: cloudPalettes, 
    isLoading: isCloudLoading, 
    isSyncing, 
    savePalette: saveToCloud, 
    deletePalette: deleteFromCloud,
    syncLocalToCloud,
    refresh: refreshCloud
  } = usePaletteSync();

  // Use cloud palettes if logged in, otherwise use local
  const savedPalettes = user ? cloudPalettes : localPalettes;
  const isLoading = user ? (isAuthLoading || isCloudLoading) : isLocalLoading;

  // Load local data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await storage.get("paletta-saved");
        if (stored) {
          setLocalPalettes(JSON.parse(stored));
        }
        
        // Check if onboarding was completed
        const onboardingComplete = await storage.get("paletta-onboarding-complete");
        if (!onboardingComplete) {
          setShowOnboarding(true);
        }
      } catch {
        // Handle error silently
      } finally {
        setIsLocalLoading(false);
      }
    };
    loadData();
  }, [storage]);

  // Save local palettes when changed (only if not logged in)
  useEffect(() => {
    if (!isLocalLoading && !user) {
      storage.set("paletta-saved", JSON.stringify(localPalettes));
    }
  }, [localPalettes, storage, isLocalLoading, user]);

  // Sync local to cloud when user logs in
  useEffect(() => {
    if (user && localPalettes.length > 0 && !isCloudLoading) {
      const syncPalettes = async () => {
        const count = await syncLocalToCloud(localPalettes);
        if (count > 0) {
          showToast(`Synced ${count} palettes to cloud`, "success");
          setLocalPalettes([]); // Clear local after sync
          storage.set("paletta-saved", "[]");
        }
      };
      syncPalettes();
    }
  }, [user, isCloudLoading]);

  const handleSavePalette = async (palette: Palette) => {
    if (user) {
      // Cloud save
      const isSaved = cloudPalettes.some((p) => p.id === palette.id);
      if (isSaved) {
        await deleteFromCloud(palette.id);
        showToast("Removed from cloud", "info");
      } else {
        await saveToCloud(palette);
        showToast("Saved to cloud", "success");
      }
    } else {
      // Local save
      setLocalPalettes((prev) => {
        const exists = prev.some((p) => p.id === palette.id);
        if (exists) {
          return prev.filter((p) => p.id !== palette.id);
        }
        return [...prev, palette];
      });
    }
  };

  const handleClearSaved = () => {
    if (confirm("Are you sure you want to clear all saved palettes?")) {
      setLocalPalettes([]); // Updated line
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

  const handleOnboardingComplete = async () => {
    await storage.set("paletta-onboarding-complete", "true");
    setShowOnboarding(false);
  };

  const handleDeletePalette = async (palette: Palette) => {
    if (user) {
      await deleteFromCloud(palette.id);
    } else {
      setLocalPalettes((prev) => prev.filter((p) => p.id !== palette.id));
    }
    showToast("Palette removed", "info");
  };

  // Filter palettes by search query
  const filteredPalettes = savedPalettes.filter((palette) =>
    palette.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    palette.colors.some((c) => c.hex.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Onboarding */}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      
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
      {activeTab === "contrast" && <ContrastChecker savedPalettes={savedPalettes} />}

      {/* Bottom Sheet: Saved Palettes */}
      {showSaved && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowSaved(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background pb-safe">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Saved Palettes</h2>
                <button
                  onClick={() => setShowSaved(false)}
                  className="rounded-full bg-secondary p-2 text-secondary-foreground"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Search */}
              {savedPalettes.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search palettes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
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
              ) : filteredPalettes.length === 0 ? (
                <div className="py-12 text-center">
                  <Search className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No palettes match your search</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-sm font-medium text-primary"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Swipe left to delete, right to share
                  </p>
                  <div className="space-y-3">
                    {filteredPalettes.map((palette) => (
                      <SwipeablePaletteCard
                        key={palette.id}
                        palette={palette}
                        onDelete={handleDeletePalette}
                        onSelect={activeTab === "visualizer" ? handleSelectForVisualizer : undefined}
                        showSelectButton={activeTab === "visualizer"}
                      />
                    ))}
                  </div>
                </>
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
              {/* Account Section */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Account
                </h3>
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{user.user_metadata?.display_name || "User"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Cloud className="h-4 w-4" />
                        <span className="text-xs">Synced</span>
                      </div>
                    </div>
                    <button
                      onClick={refreshCloud}
                      disabled={isSyncing}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
                      {isSyncing ? "Syncing..." : "Refresh Palettes"}
                    </button>
                    <button
                      onClick={signOut}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-card p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <CloudOff className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Local Storage</p>
                        <p className="text-sm text-muted-foreground">Sign in to sync across devices</p>
                      </div>
                    </div>
                    <Link
                      href="/auth/login"
                      className="block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className="block w-full rounded-xl bg-card py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              {/* Data Section */}
              <div className="mb-6">
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
              <div className="text-center">
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

export default function Home() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  );
}
