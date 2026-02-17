"use client";

import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SelectCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = context[config.field] as string;

  return (
    <div className="flex flex-col gap-3">
      {config.options?.map((option) => (
        <button
          key={option.value}
          onClick={() =>
            updateContext(config.field as keyof UserContext, option.value)
          }
          className={cn(
            "rounded-xl border-2 px-6 py-4 text-left text-lg font-medium transition-all",
            value === option.value
              ? "border-primary bg-primary/5 text-primary"
              : "border-border hover:border-primary/50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
