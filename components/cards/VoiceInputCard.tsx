"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";

export function VoiceInputCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = (context[config.field] as string) || "";
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      updateContext(config.field as keyof UserContext, transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, config.field, updateContext]);

  return (
    <div className="space-y-4">
      {/* 语音按钮 */}
      {supported && (
        <button
          onClick={toggleListening}
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full transition-all ${
            isListening
              ? "animate-pulse bg-red-500 text-white shadow-lg shadow-red-200"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        </button>
      )}
      {isListening && (
        <p className="text-center text-sm text-red-500">正在聆听...</p>
      )}

      {/* 文本输入（降级方案或补充编辑） */}
      <textarea
        value={value}
        onChange={(e) =>
          updateContext(config.field as keyof UserContext, e.target.value)
        }
        placeholder={config.placeholder}
        rows={4}
        className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
