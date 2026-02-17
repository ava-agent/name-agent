"use client";

import { Input } from "@/components/ui/input";
import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";

export function DatePickerCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = (context[config.field] as string) || "";

  return (
    <div className="space-y-4">
      <Input
        type="date"
        value={value}
        onChange={(e) =>
          updateContext(config.field as keyof UserContext, e.target.value)
        }
        className="h-12 text-lg"
      />
      <div>
        <label className="mb-2 block text-sm text-muted-foreground">
          出生时辰（可选，用于更精确的八字分析）
        </label>
        <select
          value={context.birthTime || ""}
          onChange={(e) => updateContext("birthTime", e.target.value)}
          className="h-12 w-full rounded-md border border-input bg-background px-3 text-base"
        >
          <option value="">不选择</option>
          <option value="子时(23-1点)">子时 (23:00-1:00)</option>
          <option value="丑时(1-3点)">丑时 (1:00-3:00)</option>
          <option value="寅时(3-5点)">寅时 (3:00-5:00)</option>
          <option value="卯时(5-7点)">卯时 (5:00-7:00)</option>
          <option value="辰时(7-9点)">辰时 (7:00-9:00)</option>
          <option value="巳时(9-11点)">巳时 (9:00-11:00)</option>
          <option value="午时(11-13点)">午时 (11:00-13:00)</option>
          <option value="未时(13-15点)">未时 (13:00-15:00)</option>
          <option value="申时(15-17点)">申时 (15:00-17:00)</option>
          <option value="酉时(17-19点)">酉时 (17:00-19:00)</option>
          <option value="戌时(19-21点)">戌时 (19:00-21:00)</option>
          <option value="亥时(21-23点)">亥时 (21:00-23:00)</option>
        </select>
      </div>
    </div>
  );
}
