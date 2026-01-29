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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 pt-safe transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-lg px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={cn(
                "font-bold text-foreground transition-all duration-300",
                scrolled ? "text-lg" : "text-2xl"
              )}
            >
              {title}
            </h1>
            {subtitle && !scrolled && (
              <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {rightAction}
        </div>
      </div>
    </header>
  );
}
