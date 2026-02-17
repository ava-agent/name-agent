"use client";

import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { VoiceButton } from "@/components/VoiceButton";
import { useVoiceInput } from "@/hooks/useVoiceInput";

export function VoiceInputCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = (context[config.field] as string) || "";

  const voice = useVoiceInput({
    onResult: (text) => {
      // 追加到现有文本
      const current = (context[config.field] as string) || "";
      const newText = current ? `${current} ${text}` : text;
      updateContext(config.field as keyof UserContext, newText);
    },
  });

  return (
    <div className="space-y-5">
      {/* 大号语音按钮 */}
      <div className="flex justify-center py-2">
        <VoiceButton
          isListening={voice.isListening}
          supported={voice.supported}
          onClick={voice.toggle}
          size="md"
          transcript={voice.transcript}
        />
      </div>

      {/* 文本编辑区 */}
      <textarea
        value={value}
        onChange={(e) =>
          updateContext(config.field as keyof UserContext, e.target.value)
        }
        placeholder={config.placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border-2 border-border bg-muted/30 px-4 py-3 text-base transition-colors focus:border-orange-400 focus:bg-white focus:outline-none"
      />
    </div>
  );
}
