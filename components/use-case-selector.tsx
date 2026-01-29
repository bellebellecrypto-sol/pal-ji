"use client";

import { useCases, type UseCase } from "@/lib/colors";
import { cn } from "@/lib/utils";

interface UseCaseSelectorProps {
  selectedUseCase: UseCase;
  onSelect: (useCase: UseCase) => void;
}

export function UseCaseSelector({ selectedUseCase, onSelect }: UseCaseSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {useCases.map((useCase) => (
        <button
          key={useCase.id}
          onClick={() => onSelect(useCase.id)}
          className={cn(
            "group relative flex flex-col items-start gap-1 rounded-2xl p-4 text-left transition-all duration-300 active:scale-[0.98]",
            selectedUseCase === useCase.id
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card text-card-foreground hover:bg-secondary"
          )}
        >
          <span className="text-2xl">{useCase.icon}</span>
          <span className="font-semibold text-sm">{useCase.name}</span>
          <span
            className={cn(
              "text-xs leading-tight",
              selectedUseCase === useCase.id ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            {useCase.description}
          </span>
        </button>
      ))}
    </div>
  );
}
