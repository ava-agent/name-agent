"use client";

import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { VoiceButton } from "@/components/VoiceButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { matchVoiceToOption } from "@/lib/voice-parser";
import { cn } from "@/lib/utils";

export function SelectCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = context[config.field] as string;

  const voice = useVoiceInput({
    onResult: (text) => {
      if (!config.options) return;
      const matched = matchVoiceToOption(text, config.options);
      if (matched) {
        updateContext(config.field as keyof UserContext, matched);
      }
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {config.options?.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              updateContext(config.field as keyof UserContext, option.value)
            }
            className={cn(
              "rounded-2xl border-2 px-6 py-4 text-left text-lg font-medium transition-all active:scale-[0.98]",
              value === option.value
                ? "border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 shadow-sm"
                : "border-border bg-muted/20 hover:border-orange-300 hover:bg-orange-50/50"
            )}
          >
            {option.label}
          </button>
        ))}
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
