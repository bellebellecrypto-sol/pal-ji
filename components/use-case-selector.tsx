"use client";

import { useCases, type UseCase } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface UseCaseSelectorProps {
  selectedUseCase: UseCase;
  onSelect: (useCase: UseCase) => void;
}

export function UseCaseSelector({ selectedUseCase, onSelect }: UseCaseSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {useCases.map((useCase) => {
        const isSelected = selectedUseCase === useCase.id;
        
        return (
          <button
            key={useCase.id}
            onClick={() => onSelect(useCase.id)}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-center transition-all duration-200 ease-out",
              "border-2",
              "active:scale-[0.96]",
              isSelected
                ? "border-primary/30 bg-primary/5 shadow-sm"
                : "border-transparent bg-card hover:bg-secondary/60"
            )}
          >
            {/* Gradient icon background */}
            <div 
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl text-base transition-all duration-200",
                isSelected 
                  ? "shadow-sm" 
                  : "bg-secondary/60 group-hover:scale-105"
              )}
              style={isSelected ? {
                background: `linear-gradient(135deg, ${useCase.gradient[0]}, ${useCase.gradient[1]})`,
                color: "white",
              } : undefined}
            >
              {useCase.icon}
            </div>
            
            {/* Label */}
            <span 
              className={cn(
                "text-[11px] font-semibold tracking-tight transition-colors duration-200",
                isSelected ? "text-foreground" : "text-foreground/70"
              )}
            >
              {useCase.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
