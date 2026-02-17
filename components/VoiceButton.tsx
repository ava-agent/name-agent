"use client";

import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  isProcessing?: boolean;
  supported: boolean;
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
  transcript?: string;
}

export function VoiceButton({
  isListening,
  isProcessing,
  supported,
  onClick,
  size = "sm",
  className,
  transcript,
}: VoiceButtonProps) {
  if (!supported) return null;

  const sizeClasses = size === "sm" ? "h-10 w-10" : "h-16 w-16";
  const iconSize = size === "sm" ? 16 : 28;

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={isProcessing}
        className={cn(
          "flex items-center justify-center rounded-full transition-all active:scale-95",
          sizeClasses,
          isListening
            ? "animate-pulse bg-red-500 text-white shadow-lg shadow-red-500/30"
            : isProcessing
              ? "bg-amber-400 text-white opacity-70"
              : "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30"
        )}
      >
        {isProcessing ? (
          <svg className="animate-spin" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
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
        )}
      </button>
      {/* 录音中 / 处理中 / 结果 - 都显示 */}
      {(isListening || isProcessing || transcript) && (
        <span
          className={cn(
            "max-w-[200px] truncate text-xs",
            isListening
              ? "text-red-500"
              : isProcessing
                ? "text-amber-600"
                : "text-orange-600"
          )}
        >
          {isListening && !transcript
            ? "说话中..."
            : transcript || "识别中..."}
        </span>
      )}
    </div>
  );
}
