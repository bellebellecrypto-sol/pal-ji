"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Palette, Eye, ImageIcon, ArrowRight, ChevronRight } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Sparkles,
    title: "Generate Palettes",
    description: "Create harmonious color combinations for any purpose - branding, UI design, interiors, and more.",
    colors: ["#FF6B6B", "#FEC89A", "#FFD93D", "#6BCB77", "#4D96FF"],
  },
  {
    icon: Palette,
    title: "Explore Curated Colors",
    description: "Browse hand-picked palettes and discover trending color schemes from our collection.",
    colors: ["#1A4D2E", "#4F6F52", "#739072", "#A3B899", "#E9F5DB"],
  },
  {
    icon: Eye,
    title: "Visualize in Context",
    description: "See how your palettes look applied to real UI mockups - apps, dashboards, and websites.",
    colors: ["#6366F1", "#8B5CF6", "#A855F7", "#1E293B", "#F8FAFC"],
  },
  {
    icon: ImageIcon,
    title: "Extract from Images",
    description: "Upload any photo and automatically extract the dominant colors to create unique palettes.",
    colors: ["#8E6B5E", "#C9ADA7", "#E8D5D1", "#F2E9E4", "#9A8C98"],
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-safe">
        <span className="text-xl font-bold tracking-tight text-foreground">pal</span>
        <button
          onClick={handleSkip}
          className="group flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
        >
          Skip
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {/* Icon with animated background */}
        <div 
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl shadow-lg transition-all duration-500"
          style={{ backgroundColor: `${slide.colors[2]}15` }}
        >
          <Icon 
            className="h-12 w-12 transition-all duration-500" 
            style={{ color: slide.colors[2] }} 
          />
        </div>

        {/* Color Preview with enhanced styling */}
        <div className="mb-10 flex h-20 w-full max-w-xs overflow-hidden rounded-3xl shadow-xl ring-1 ring-border/10">
          {slide.colors.map((color, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-700 ease-out"
              style={{ 
                backgroundColor: color,
                transform: `scaleY(${1 + (i === 2 ? 0.05 : 0)})`
              }}
            />
          ))}
        </div>

        {/* Text with improved typography */}
        <h1 className="mb-3 text-center text-2xl font-bold tracking-tight text-foreground">
          {slide.title}
        </h1>
        <p className="max-w-sm text-center text-base leading-relaxed text-muted-foreground">
          {slide.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="p-8 pb-safe">
        {/* Progress dots with enhanced interaction */}
        <div className="mb-6 flex items-center justify-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 ease-out",
                i === currentSlide 
                  ? "w-10 bg-foreground" 
                  : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>

        {/* Next button with premium feel */}
        <button
          onClick={handleNext}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-base font-semibold text-background shadow-lg transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
        >
          {isLastSlide ? "Get Started" : "Continue"}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
