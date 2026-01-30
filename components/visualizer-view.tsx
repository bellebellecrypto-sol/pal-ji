"use client";

import { useState } from "react";
import { type Palette, getContrastColor } from "@/lib/colors";
import { IosHeader } from "./ios-header";
import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-native";
import {
  Smartphone,
  Monitor,
  CreditCard,
  Mail,
  LayoutDashboard,
} from "lucide-react";

type VisualizerMode = "mobile" | "dashboard" | "card" | "email" | "website";

interface VisualizerViewProps {
  palette: Palette | null;
  onSelectPalette: () => void;
}

const modes: { id: VisualizerMode; label: string; icon: typeof Smartphone }[] = [
  { id: "mobile", label: "Mobile App", icon: Smartphone },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "email", label: "Email", icon: Mail },
  { id: "website", label: "Website", icon: Monitor },
];

export function VisualizerView({ palette, onSelectPalette }: VisualizerViewProps) {
  const [mode, setMode] = useState<VisualizerMode>("mobile");
  const { selection } = useHaptics();

  const handleModeChange = async (newMode: VisualizerMode) => {
    await selection();
    setMode(newMode);
  };

  const colors = palette?.colors || [
    { hex: "#6366F1", name: "Primary" },
    { hex: "#8B5CF6", name: "Secondary" },
    { hex: "#1E293B", name: "Dark" },
    { hex: "#64748B", name: "Muted" },
    { hex: "#F8FAFC", name: "Light" },
  ];

  const [primary, secondary, dark, muted, light] = colors;

  return (
    <div className="min-h-screen pb-28">
      <IosHeader title="Visualizer" subtitle="See your palette in action" />

      <main className="mx-auto max-w-lg px-6 pt-24">
        {/* Mode Selector */}
        <div className="mb-6 -mx-6 px-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    mode === m.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Palette Button */}
        <button
          onClick={onSelectPalette}
          className={cn(
            "mb-6 w-full rounded-2xl border-2 p-4 text-center transition-all duration-200",
            palette 
              ? "border-primary/30 bg-primary/5 hover:bg-primary/10" 
              : "border-dashed border-border bg-secondary/50 hover:bg-secondary hover:border-muted-foreground"
          )}
        >
          {palette ? (
            <>
              <div className="mb-2 flex justify-center gap-1.5">
                {palette.colors.map((c, i) => (
                  <span
                    key={i}
                    className="h-6 w-6 rounded-lg ring-1 ring-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-foreground">{palette.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Tap to change palette</p>
            </>
          ) : (
            <>
              <div className="mb-2 flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="h-6 w-6 rounded-lg bg-muted animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-foreground">Select a palette</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Choose from your saved palettes to preview
              </p>
            </>
          )}
        </button>

        {/* Visualizer Preview */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          {mode === "mobile" && (
            <MobileAppPreview primary={primary} secondary={secondary} dark={dark} muted={muted} light={light} />
          )}
          {mode === "dashboard" && (
            <DashboardPreview primary={primary} secondary={secondary} dark={dark} muted={muted} light={light} />
          )}
          {mode === "card" && (
            <CardPreview primary={primary} secondary={secondary} dark={dark} muted={muted} light={light} />
          )}
          {mode === "email" && (
            <EmailPreview primary={primary} secondary={secondary} dark={dark} muted={muted} light={light} />
          )}
          {mode === "website" && (
            <WebsitePreview primary={primary} secondary={secondary} dark={dark} muted={muted} light={light} />
          )}
        </div>

        {/* Color Legend */}
        <div className="mt-6 grid grid-cols-5 gap-2">
          {colors.map((c, i) => (
            <div key={i} className="text-center">
              <div
                className="mx-auto mb-1 h-8 w-8 rounded-full border border-border"
                style={{ backgroundColor: c.hex }}
              />
              <p className="text-xs text-muted-foreground">{["Primary", "Secondary", "Dark", "Muted", "Light"][i]}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

interface PreviewProps {
  primary: { hex: string };
  secondary: { hex: string };
  dark: { hex: string };
  muted: { hex: string };
  light: { hex: string };
}

function MobileAppPreview({ primary, secondary, dark, muted, light }: PreviewProps) {
  return (
    <div className="relative mx-auto w-[240px] overflow-hidden rounded-[24px] border-4" style={{ borderColor: dark.hex }}>
      <div className="h-[480px]" style={{ backgroundColor: light.hex }}>
        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: primary.hex }}>
          <span className="text-xs font-medium" style={{ color: getContrastColor(primary.hex) }}>9:41</span>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getContrastColor(primary.hex) }} />
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getContrastColor(primary.hex) }} />
          </div>
        </div>

        {/* Header */}
        <div className="p-4" style={{ backgroundColor: primary.hex }}>
          <h3 className="text-lg font-bold" style={{ color: getContrastColor(primary.hex) }}>Welcome Back</h3>
          <p className="text-sm opacity-80" style={{ color: getContrastColor(primary.hex) }}>Here is your dashboard</p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="rounded-xl p-4" style={{ backgroundColor: secondary.hex }}>
            <p className="text-sm font-medium" style={{ color: getContrastColor(secondary.hex) }}>Total Balance</p>
            <p className="text-2xl font-bold" style={{ color: getContrastColor(secondary.hex) }}>$12,450</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-3" style={{ backgroundColor: dark.hex }}>
              <p className="text-xs" style={{ color: getContrastColor(dark.hex) }}>Income</p>
              <p className="font-bold" style={{ color: getContrastColor(dark.hex) }}>$8,200</p>
            </div>
            <div className="rounded-lg p-3" style={{ backgroundColor: muted.hex }}>
              <p className="text-xs" style={{ color: getContrastColor(muted.hex) }}>Expenses</p>
              <p className="font-bold" style={{ color: getContrastColor(muted.hex) }}>$4,100</p>
            </div>
          </div>

          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-3" style={{ borderColor: muted.hex }}>
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: primary.hex }} />
                <div className="flex-1">
                  <div className="h-2 w-20 rounded" style={{ backgroundColor: dark.hex }} />
                  <div className="mt-1 h-2 w-12 rounded" style={{ backgroundColor: muted.hex }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around border-t p-3" style={{ backgroundColor: light.hex, borderColor: muted.hex }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-6 rounded-full" style={{ backgroundColor: i === 1 ? primary.hex : muted.hex }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPreview({ primary, secondary, dark, muted, light }: PreviewProps) {
  return (
    <div className="h-[350px] p-4" style={{ backgroundColor: light.hex }}>
      {/* Sidebar indicator */}
      <div className="flex gap-4 h-full">
        <div className="w-12 rounded-xl" style={{ backgroundColor: dark.hex }}>
          <div className="space-y-3 p-2 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 w-6 mx-auto rounded-lg" style={{ backgroundColor: i === 1 ? primary.hex : muted.hex }} />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 w-24 rounded" style={{ backgroundColor: dark.hex }} />
              <div className="mt-1 h-3 w-16 rounded" style={{ backgroundColor: muted.hex }} />
            </div>
            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: secondary.hex }} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[primary, secondary, dark].map((color, i) => (
              <div key={i} className="rounded-xl p-3" style={{ backgroundColor: color.hex }}>
                <div className="h-3 w-12 rounded" style={{ backgroundColor: getContrastColor(color.hex), opacity: 0.7 }} />
                <div className="mt-2 h-5 w-16 rounded" style={{ backgroundColor: getContrastColor(color.hex) }} />
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="flex-1 rounded-xl p-4" style={{ backgroundColor: "#ffffff", border: `1px solid ${muted.hex}` }}>
            <div className="flex h-full items-end justify-around gap-2">
              {[60, 80, 45, 90, 70, 85, 55].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? primary.hex : secondary.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardPreview({ primary, secondary, dark, muted, light }: PreviewProps) {
  return (
    <div className="flex items-center justify-center p-8" style={{ backgroundColor: light.hex }}>
      <div className="w-full max-w-[280px] space-y-4">
        {/* Credit Card Style */}
        <div
          className="relative h-[160px] rounded-2xl p-4"
          style={{
            background: `linear-gradient(135deg, ${primary.hex} 0%, ${secondary.hex} 100%)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="h-8 w-10 rounded" style={{ backgroundColor: getContrastColor(primary.hex), opacity: 0.3 }} />
            <div className="text-sm font-bold" style={{ color: getContrastColor(primary.hex) }}>VISA</div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="font-mono text-lg tracking-wider" style={{ color: getContrastColor(primary.hex) }}>
              **** **** **** 4589
            </p>
            <div className="mt-2 flex justify-between text-xs" style={{ color: getContrastColor(primary.hex), opacity: 0.8 }}>
              <span>JOHN DOE</span>
              <span>12/28</span>
            </div>
          </div>
        </div>

        {/* Product Card */}
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: muted.hex, backgroundColor: "#ffffff" }}>
          <div className="h-24" style={{ backgroundColor: secondary.hex }} />
          <div className="p-4">
            <div className="h-3 w-20 rounded" style={{ backgroundColor: dark.hex }} />
            <div className="mt-2 h-2 w-32 rounded" style={{ backgroundColor: muted.hex }} />
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold" style={{ color: primary.hex }}>$49.00</span>
              <button className="rounded-lg px-3 py-1 text-sm" style={{ backgroundColor: primary.hex, color: getContrastColor(primary.hex) }}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailPreview({ primary, secondary, dark, muted, light }: PreviewProps) {
  return (
    <div className="p-4" style={{ backgroundColor: muted.hex }}>
      <div className="mx-auto max-w-[300px] overflow-hidden rounded-xl" style={{ backgroundColor: light.hex }}>
        {/* Email Header */}
        <div className="p-6 text-center" style={{ backgroundColor: primary.hex }}>
          <div className="mx-auto mb-3 h-12 w-12 rounded-full" style={{ backgroundColor: getContrastColor(primary.hex), opacity: 0.2 }} />
          <h3 className="text-lg font-bold" style={{ color: getContrastColor(primary.hex) }}>Welcome!</h3>
          <p className="mt-1 text-sm opacity-80" style={{ color: getContrastColor(primary.hex) }}>Thanks for signing up</p>
        </div>

        {/* Email Body */}
        <div className="p-6">
          <div className="space-y-2">
            <div className="h-2 w-full rounded" style={{ backgroundColor: dark.hex }} />
            <div className="h-2 w-4/5 rounded" style={{ backgroundColor: muted.hex }} />
            <div className="h-2 w-full rounded" style={{ backgroundColor: muted.hex }} />
            <div className="h-2 w-3/4 rounded" style={{ backgroundColor: muted.hex }} />
          </div>

          <button
            className="mt-6 w-full rounded-lg py-3 text-center font-semibold"
            style={{ backgroundColor: secondary.hex, color: getContrastColor(secondary.hex) }}
          >
            Get Started
          </button>

          <div className="mt-6 space-y-2">
            <div className="h-2 w-full rounded" style={{ backgroundColor: muted.hex }} />
            <div className="h-2 w-2/3 rounded" style={{ backgroundColor: muted.hex }} />
          </div>
        </div>

        {/* Email Footer */}
        <div className="border-t p-4 text-center" style={{ borderColor: muted.hex }}>
          <p className="text-xs" style={{ color: muted.hex }}>Unsubscribe | Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}

function WebsitePreview({ primary, secondary, dark, muted, light }: PreviewProps) {
  return (
    <div className="h-[350px]" style={{ backgroundColor: light.hex }}>
      {/* Nav */}
      <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: muted.hex }}>
        <div className="h-4 w-16 rounded" style={{ backgroundColor: primary.hex }} />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-2 w-10 rounded" style={{ backgroundColor: dark.hex }} />
          ))}
        </div>
        <button className="rounded px-3 py-1 text-xs" style={{ backgroundColor: primary.hex, color: getContrastColor(primary.hex) }}>
          Sign Up
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 py-8 text-center">
        <div className="mx-auto h-4 w-40 rounded" style={{ backgroundColor: dark.hex }} />
        <div className="mx-auto mt-2 h-3 w-56 rounded" style={{ backgroundColor: muted.hex }} />
        <div className="mx-auto mt-4 flex justify-center gap-2">
          <button className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: primary.hex, color: getContrastColor(primary.hex) }}>
            Get Started
          </button>
          <button className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: secondary.hex, color: getContrastColor(secondary.hex) }}>
            Learn More
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-3 px-4">
        {[primary, secondary, dark].map((color, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${color.hex}15` }}>
            <div className="mx-auto mb-2 h-8 w-8 rounded-full" style={{ backgroundColor: color.hex }} />
            <div className="mx-auto h-2 w-12 rounded" style={{ backgroundColor: dark.hex }} />
            <div className="mx-auto mt-1 h-2 w-16 rounded" style={{ backgroundColor: muted.hex }} />
          </div>
        ))}
      </div>
    </div>
  );
}
