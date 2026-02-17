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
import { Progress } from "@/components/ui/progress";
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
    <div className="flex h-full flex-col">
      {/* 进度条 */}
      <div className="px-6 pt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {group?.icon} {group?.name}
          </span>
          <span className="text-muted-foreground">
            {currentCardIndex + 1} / {CARDS.length}
          </span>
        </div>
        <Progress value={progress()} className="h-1.5" />
      </div>

      {/* 卡片区域 */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="rounded-2xl border bg-card p-6 shadow-lg">
              <h2 className="mb-2 text-xl font-semibold">
                {currentCard.title}
              </h2>
              {currentCard.description && (
                <p className="mb-6 text-sm text-muted-foreground">
                  {currentCard.description}
                </p>
              )}
              {renderCard(currentCard.id)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 底部按钮 */}
      <div className="flex gap-3 px-6 pb-8">
        {currentCardIndex > 0 && (
          <Button variant="outline" onClick={prevCard} className="flex-1">
            上一步
          </Button>
        )}
        {!currentCard.required && (
          <Button variant="ghost" onClick={handleSkip} className="flex-1">
            跳过
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={currentCard.required && !canProceed()}
          className="flex-1"
        >
          {isLastCard() ? "开始起名" : "下一步"}
        </Button>
      </div>
    </div>
  );
}
