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
      <div className="flex items-center justify-between px-5 py-4 pt-safe">
        <span className="text-xl font-bold tracking-tight text-foreground">pal</span>
        <button
          onClick={handleSkip}
          className="group flex items-center gap-0.5 rounded-xl px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
        >
          Skip
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {/* Icon with animated background */}
        <div 
          className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl shadow-md transition-all duration-500"
          style={{ backgroundColor: `${slide.colors[2]}12` }}
        >
          <Icon 
            className="h-10 w-10 transition-all duration-500" 
            style={{ color: slide.colors[2] }} 
          />
        </div>

        {/* Color Preview with enhanced styling */}
        <div className="mb-10 flex h-16 w-full max-w-[280px] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
          {slide.colors.map((color, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-700 ease-out"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Text with improved typography */}
        <h1 className="mb-2 text-center text-xl font-bold tracking-tight text-foreground">
          {slide.title}
        </h1>
        <p className="max-w-[300px] text-center text-[15px] leading-relaxed text-muted-foreground">
          {slide.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-8 pb-safe">
        {/* Progress dots with enhanced interaction */}
        <div className="mb-5 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 ease-out",
                i === currentSlide 
                  ? "w-8 bg-primary" 
                  : "w-1.5 bg-border hover:bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Next button with premium feel */}
        <button
          onClick={handleNext}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-[15px] font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
        >
          {isLastSlide ? "Get Started" : "Continue"}
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
