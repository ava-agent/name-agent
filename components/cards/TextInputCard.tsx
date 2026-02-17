"use client";

import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { VoiceButton } from "@/components/VoiceButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";

export function TextInputCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = (context[config.field] as string) || "";

  const voice = useVoiceInput({
    onResult: (text) => {
      updateContext(config.field as keyof UserContext, text);
    },
  });

  return (
    <div className="flex items-center gap-3">
      <input
        value={value}
        onChange={(e) =>
          updateContext(config.field as keyof UserContext, e.target.value)
        }
        placeholder={config.placeholder}
        className="h-14 flex-1 rounded-xl border-2 border-border bg-muted/30 px-4 text-lg transition-colors focus:border-orange-400 focus:bg-white focus:outline-none"
        autoFocus
      />
      <VoiceButton
        isListening={voice.isListening}
        supported={voice.supported}
        onClick={voice.toggle}
        transcript={voice.transcript}
      />
    </div>
  );
}
