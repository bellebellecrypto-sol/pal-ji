"use client";

import React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface IosHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export function IosHeader({ title, subtitle, rightAction }: IosHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-40 pt-safe transition-all duration-300 ease-out",
        scrolled
          ? "bg-background/90 backdrop-blur-2xl border-b border-border/60 shadow-sm"
          : "bg-gradient-to-b from-background via-background/80 to-transparent"
      )}
    >
      <div className="mx-auto max-w-lg px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1
              className={cn(
                "font-bold tracking-tight text-foreground transition-all duration-300 ease-out",
                scrolled ? "text-lg" : "text-2xl"
              )}
            >
              {title}
            </h1>
            <p 
              className={cn(
                "text-sm text-muted-foreground transition-all duration-300 ease-out",
                scrolled ? "h-0 opacity-0 mt-0" : "h-auto opacity-100 mt-0.5"
              )}
            >
              {subtitle}
            </p>
          </div>
          {rightAction && (
            <div className="ml-4 flex-shrink-0">{rightAction}</div>
          )}
        </div>
      </div>
    </header>
  );
}
