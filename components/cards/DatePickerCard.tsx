"use client";

import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { VoiceButton } from "@/components/VoiceButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";

export function DatePickerCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = (context[config.field] as string) || "";

  const voice = useVoiceInput({
    onResult: (text) => {
      // 尝试从语音中提取日期, 如 "2024年3月15日" → "2024-03-15"
      const match = text.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日?/);
      if (match) {
        const [, y, m, d] = match;
        const dateStr = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        updateContext(config.field as keyof UserContext, dateStr);
      }
      // 也尝试匹配时辰
      const timeKeywords = [
        { key: "子时", val: "子时(23-1点)" },
        { key: "丑时", val: "丑时(1-3点)" },
        { key: "寅时", val: "寅时(3-5点)" },
        { key: "卯时", val: "卯时(5-7点)" },
        { key: "辰时", val: "辰时(7-9点)" },
        { key: "巳时", val: "巳时(9-11点)" },
        { key: "午时", val: "午时(11-13点)" },
        { key: "未时", val: "未时(13-15点)" },
        { key: "申时", val: "申时(15-17点)" },
        { key: "酉时", val: "酉时(17-19点)" },
        { key: "戌时", val: "戌时(19-21点)" },
        { key: "亥时", val: "亥时(21-23点)" },
      ];
      for (const t of timeKeywords) {
        if (text.includes(t.key)) {
          updateContext("birthTime", t.val);
          break;
        }
      }
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="date"
          value={value}
          onChange={(e) =>
            updateContext(config.field as keyof UserContext, e.target.value)
          }
          className="h-14 flex-1 rounded-xl border-2 border-border bg-muted/30 px-4 text-lg transition-colors focus:border-orange-400 focus:bg-white focus:outline-none"
        />
        <VoiceButton
          isListening={voice.isListening}
          isProcessing={voice.isProcessing}
          supported={voice.supported}
          onClick={voice.toggle}
          transcript={voice.transcript}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted-foreground">
          出生时辰（可选）
        </label>
        <select
          value={context.birthTime || ""}
          onChange={(e) => updateContext("birthTime", e.target.value)}
          className="h-14 w-full rounded-xl border-2 border-border bg-muted/30 px-4 text-base transition-colors focus:border-orange-400 focus:bg-white focus:outline-none"
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
