"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

export interface Gradient {
  id: string;
  name: string;
  type: "linear" | "radial" | "conic";
  colors: string[];
  angle: number;
  css_value: string;
}

interface DBGradient {
  id: string;
  name: string;
  type: string;
  colors: string[];
  angle: number;
  css_value: string;
  created_at: string;
  updated_at: string;
}

export function useGradientSync() {
  const { user } = useAuth();
  const [gradients, setGradients] = useState<Gradient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const supabase = createClient();

  const fetchGradients = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("gradients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: Gradient[] = (data as DBGradient[]).map((g) => ({
        id: g.id,
        name: g.name,
        type: g.type as Gradient["type"],
        colors: g.colors,
        angle: g.angle,
        css_value: g.css_value,
      }));

      setGradients(formatted);
    } catch (error) {
      console.error("Error fetching gradients:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchGradients();
  }, [fetchGradients]);

  const saveGradient = async (gradient: Gradient): Promise<boolean> => {
    if (!user) return false;

    setIsSyncing(true);
    try {
      const { error } = await supabase.from("gradients").upsert({
        id: gradient.id,
        user_id: user.id,
        name: gradient.name,
        type: gradient.type,
        colors: gradient.colors,
        angle: gradient.angle,
        css_value: gradient.css_value,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      await fetchGradients();
      return true;
    } catch (error) {
      console.error("Error saving gradient:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteGradient = async (gradientId: string): Promise<boolean> => {
    if (!user) return false;

    setIsSyncing(true);
    try {
      const { error } = await supabase.from("gradients").delete().eq("id", gradientId);

      if (error) throw error;

      setGradients((prev) => prev.filter((g) => g.id !== gradientId));
      return true;
    } catch (error) {
      console.error("Error deleting gradient:", error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    gradients,
    isLoading,
    isSyncing,
    saveGradient,
    deleteGradient,
    refresh: fetchGradients,
  };
}
