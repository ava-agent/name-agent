"use client";

import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MultiSelectCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const selected = (context[config.field] as string[]) || [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : selected.length < 3
        ? [...selected, value]
        : selected;
    updateContext(config.field as keyof UserContext, next);
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {config.options?.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => toggle(option.value)}
            className={cn(
              "rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all active:scale-95",
              isSelected
                ? "border-orange-400 bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-sm shadow-orange-500/20"
                : "border-border bg-muted/20 hover:border-orange-300 hover:bg-orange-50/50"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
