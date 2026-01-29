"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";
import type { Palette } from "@/lib/colors";

interface DBPalette {
  id: string;
  name: string;
  colors: { hex: string; name: string }[];
  use_case: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export function usePaletteSync() {
  const { user } = useAuth();
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const supabase = createClient();

  // Fetch palettes from Supabase
  const fetchPalettes = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("palettes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: Palette[] = (data as DBPalette[]).map((p) => ({
        id: p.id,
        name: p.name,
        colors: p.colors,
        useCase: p.use_case || undefined,
      }));

      setPalettes(formatted);
      setLastSynced(new Date());
    } catch (error) {
      console.error("Error fetching palettes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  // Initial fetch
  useEffect(() => {
    fetchPalettes();
  }, [fetchPalettes]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("palettes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "palettes",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchPalettes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, fetchPalettes]);

  // Save palette to Supabase
  const savePalette = async (palette: Palette): Promise<boolean> => {
    if (!user) return false;

    setIsSyncing(true);
    try {
      const { error } = await supabase.from("palettes").upsert({
        id: palette.id,
        user_id: user.id,
        name: palette.name,
        colors: palette.colors,
        use_case: palette.useCase || null,
        is_favorite: true,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      await fetchPalettes();
      return true;
    } catch (error) {
      console.error("Error saving palette:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete palette from Supabase
  const deletePalette = async (paletteId: string): Promise<boolean> => {
    if (!user) return false;

    setIsSyncing(true);
    try {
      const { error } = await supabase.from("palettes").delete().eq("id", paletteId);

      if (error) throw error;

      setPalettes((prev) => prev.filter((p) => p.id !== paletteId));
      return true;
    } catch (error) {
      console.error("Error deleting palette:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (paletteId: string): Promise<boolean> => {
    const palette = palettes.find((p) => p.id === paletteId);
    if (!palette || !user) return false;

    // If palette exists, delete it (unfavorite)
    return deletePalette(paletteId);
  };

  // Check if palette is saved
  const isPaletteSaved = (paletteId: string): boolean => {
    return palettes.some((p) => p.id === paletteId);
  };

  // Sync local palettes to cloud (for migration)
  const syncLocalToCloud = async (localPalettes: Palette[]): Promise<number> => {
    if (!user) return 0;

    let synced = 0;
    for (const palette of localPalettes) {
      const success = await savePalette(palette);
      if (success) synced++;
    }
    return synced;
  };

  return {
    palettes,
    isLoading,
    isSyncing,
    lastSynced,
    savePalette,
    deletePalette,
    toggleFavorite,
    isPaletteSaved,
    syncLocalToCloud,
    refresh: fetchPalettes,
  };
}
