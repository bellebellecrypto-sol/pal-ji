"use client";

import { useCases, type UseCase } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface UseCaseSelectorProps {
  selectedUseCase: UseCase;
  onSelect: (useCase: UseCase) => void;
}

export function UseCaseSelector({ selectedUseCase, onSelect }: UseCaseSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {useCases.map((useCase) => {
        const isSelected = selectedUseCase === useCase.id;
        
        return (
          <button
            key={useCase.id}
            onClick={() => onSelect(useCase.id)}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-center transition-all duration-300 ease-out",
              "border border-transparent",
              "active:scale-[0.95]",
              isSelected
                ? "border-foreground/10 shadow-lg"
                : "bg-card hover:bg-secondary/50 hover:shadow-md"
            )}
            style={isSelected ? {
              background: `linear-gradient(135deg, ${useCase.gradient[0]}15, ${useCase.gradient[1]}25)`,
            } : undefined}
          >
            {/* Gradient icon background */}
            <div 
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all duration-300",
                isSelected 
                  ? "shadow-md" 
                  : "bg-secondary/50 group-hover:scale-105"
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
                "text-xs font-semibold tracking-tight transition-colors duration-300",
                isSelected ? "text-foreground" : "text-foreground/80"
              )}
            >
              {useCase.name}
            </span>
            
            {/* Description - only show on selected */}
            <span 
              className={cn(
                "text-[10px] leading-tight transition-all duration-300",
                isSelected 
                  ? "text-muted-foreground opacity-100" 
                  : "text-muted-foreground/60 opacity-0 h-0"
              )}
            >
              {useCase.description}
            </span>
            
            {/* Selection indicator dot */}
            <div 
              className={cn(
                "absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-all duration-300",
                isSelected 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-0"
              )}
              style={{ backgroundColor: useCase.gradient[0] }}
            />
          </button>
        );
      })}
    </div>
  );
}
