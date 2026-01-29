"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Palette, Eye, ImageIcon, ArrowRight } from "lucide-react";

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
      {/* Skip button */}
      <div className="flex justify-end p-4 pt-safe">
        <button
          onClick={handleSkip}
          className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {/* Icon */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
          <Icon className="h-10 w-10 text-primary-foreground" style={{ color: slide.colors[2] }} />
        </div>

        {/* Color Preview */}
        <div className="mb-8 flex h-16 w-full max-w-xs overflow-hidden rounded-2xl shadow-lg">
          {slide.colors.map((color, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-500"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Text */}
        <h1 className="mb-3 text-center text-2xl font-bold text-foreground">{slide.title}</h1>
        <p className="max-w-sm text-center text-base leading-relaxed text-muted-foreground">
          {slide.description}
        </p>
      </div>

      {/* Bottom section */}
      <div className="p-8 pb-safe">
        {/* Dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === currentSlide ? "w-8 bg-foreground" : "w-2 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-base font-semibold text-background transition-all active:scale-[0.98]"
        >
          {isLastSlide ? "Get Started" : "Continue"}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
