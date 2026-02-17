"use client";

import { Slider } from "@/components/ui/slider";
import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";

export function SliderCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = (context[config.field] as number) ?? 5;

  return (
    <div className="space-y-6">
      <Slider
        value={[value]}
        onValueChange={([v]) =>
          updateContext(config.field as keyof UserContext, v)
        }
        min={config.min ?? 1}
        max={config.max ?? 10}
        step={1}
        className="py-4"
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{config.minLabel}</span>
        <span className="font-medium text-foreground">{value}</span>
        <span>{config.maxLabel}</span>
      </div>
    </div>
  );
}
