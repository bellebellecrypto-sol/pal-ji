"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferences: {
    haptics_enabled: boolean;
    default_color_count: number;
    default_export_format: string;
  };
  created_at: string;
  updated_at: string;
}

const defaultPreferences = {
  haptics_enabled: true,
  default_color_count: 5,
  default_export_format: "css",
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile({
          ...data,
          preferences: data.preferences || defaultPreferences,
        });
      } else {
        // Create default profile
        const newProfile = {
          id: user.id,
          display_name: user.user_metadata?.display_name || null,
          avatar_url: null,
          preferences: defaultPreferences,
        };

        const { data: created, error: createError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        setProfile(created);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  const updatePreferences = async (
    preferences: Partial<UserProfile["preferences"]>
  ): Promise<boolean> => {
    if (!profile) return false;

    const newPreferences = {
      ...profile.preferences,
      ...preferences,
    };

    return updateProfile({ preferences: newPreferences });
  };

  return {
    profile,
    isLoading,
    updateProfile,
    updatePreferences,
    refresh: fetchProfile,
  };
}
