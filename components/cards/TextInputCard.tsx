"use client";

import { Input } from "@/components/ui/input";
import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";

export function TextInputCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = (context[config.field] as string) || "";

  return (
    <Input
      value={value}
      onChange={(e) =>
        updateContext(config.field as keyof UserContext, e.target.value)
      }
      placeholder={config.placeholder}
      className="h-12 text-lg"
      autoFocus
    />
  );
}
