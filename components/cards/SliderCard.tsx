"use client";

import { Slider } from "@/components/ui/slider";
import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { VoiceButton } from "@/components/VoiceButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { matchVoiceToSlider } from "@/lib/voice-parser";

export function SliderCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = (context[config.field] as number) ?? 5;
  const min = config.min ?? 1;
  const max = config.max ?? 10;

  const voice = useVoiceInput({
    onResult: (text) => {
      const matched = matchVoiceToSlider(text, min, max);
      if (matched !== null) {
        updateContext(config.field as keyof UserContext, matched);
      }
    },
  });

  // 计算进度百分比用于渐变
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-6">
      <div className="relative pt-2">
        <Slider
          value={[value]}
          onValueChange={([v]) =>
            updateContext(config.field as keyof UserContext, v)
          }
          min={min}
          max={max}
          step={1}
          className="py-4"
        />
        {/* 当前值气泡 */}
        <div
          className="absolute -top-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm"
          style={{ left: `${pct}%` }}
        >
          {value}
        </div>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{config.minLabel}</span>
        <span>{config.maxLabel}</span>
      </div>
      <div className="flex justify-center">
        <VoiceButton
          isListening={voice.isListening}
          supported={voice.supported}
          onClick={voice.toggle}
          transcript={voice.transcript}
        />
      </div>
    </div>
  );
}
