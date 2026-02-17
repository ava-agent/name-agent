"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CARDS, CARD_GROUPS } from "@/lib/cards-config";
import { useFlowStore } from "@/stores/flow-store";
import { TextInputCard } from "./TextInputCard";
import { SelectCard } from "./SelectCard";
import { MultiSelectCard } from "./MultiSelectCard";
import { SliderCard } from "./SliderCard";
import { DatePickerCard } from "./DatePickerCard";
import { VoiceInputCard } from "./VoiceInputCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function renderCard(cardId: string) {
  const card = CARDS.find((c) => c.id === cardId);
  if (!card) return null;

  switch (card.type) {
    case "text-input":
      return <TextInputCard config={card} />;
    case "select":
      return <SelectCard config={card} />;
    case "multi-select":
      return <MultiSelectCard config={card} />;
    case "slider":
      return <SliderCard config={card} />;
    case "date-picker":
      return <DatePickerCard config={card} />;
    case "voice-input":
      return <VoiceInputCard config={card} />;
    default:
      return null;
  }
}

export function CardStack() {
  const router = useRouter();
  const {
    currentCardIndex,
    nextCard,
    prevCard,
    progress,
    context,
    isLastCard,
  } = useFlowStore();

  const currentCard = CARDS[currentCardIndex];
  const group = CARD_GROUPS.find((g) => g.id === currentCard.group);

  const canProceed = () => {
    if (!currentCard.required) return true;
    const value = context[currentCard.field];
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null;
  };

  const handleNext = () => {
    if (isLastCard()) {
      router.push("/result");
    } else {
      nextCard();
    }
  };

  const handleSkip = () => {
    if (isLastCard()) {
      router.push("/result");
    } else {
      nextCard();
    }
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 top-20 h-48 w-48 rounded-full bg-orange-100/50 blur-3xl" />
        <div className="absolute -left-16 bottom-32 h-56 w-56 rounded-full bg-amber-100/40 blur-3xl" />
      </div>

      {/* 顶部导航 + 进度 */}
      <div className="relative z-10 px-6 pt-5 pb-2">
        {/* 返回按钮 + 组名 */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentCardIndex > 0) {
                prevCard();
              } else {
                router.push("/");
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="text-sm">{group?.icon}</span>
            <span className="text-sm font-medium text-foreground/70">
              {group?.name}
            </span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {currentCardIndex + 1}/{CARDS.length}
          </div>
        </div>

        {/* 进度条 */}
        <div className="h-1.5 overflow-hidden rounded-full bg-orange-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
            initial={false}
            animate={{ width: `${progress()}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* 卡片区域 */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-orange-900/5 backdrop-blur-md">
              <h2 className="mb-1.5 text-xl font-bold text-foreground">
                {currentCard.title}
              </h2>
              {currentCard.description && (
                <p className="mb-5 text-sm text-muted-foreground">
                  {currentCard.description}
                </p>
              )}
              {!currentCard.description && <div className="mb-5" />}
              {renderCard(currentCard.id)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部按钮 */}
      <div className="relative z-10 flex gap-3 px-6 pb-8">
        {!currentCard.required && (
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 rounded-2xl text-muted-foreground"
          >
            跳过
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={currentCard.required && !canProceed()}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-base font-semibold shadow-md shadow-orange-500/20 transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          {isLastCard() ? "开始起名 ✨" : "下一步"}
        </Button>
      </div>
    </div>
  );
}
