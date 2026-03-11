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
import { easing, duration, stagger } from "@/lib/motion";

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

// Card transition variants
const cardVariants = {
  enter: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    filter: "blur(4px)",
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    filter: "blur(2px)",
  },
};

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
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.immersive, ease: easing.easeOut }}
          className="absolute -right-16 top-20 h-48 w-48 rounded-full bg-orange-100/50 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.immersive, delay: 0.1, ease: easing.easeOut }}
          className="absolute -left-16 bottom-32 h-56 w-56 rounded-full bg-amber-100/40 blur-3xl"
        />
      </div>

      {/* Header Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.standard, ease: easing.easeOut }}
        className="relative z-10 px-6 pt-5 pb-2"
      >
        {/* Back Button + Group Badge + Progress */}
        <div className="mb-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: duration.instant, ease: easing.iOS }}
            onClick={() => {
              if (currentCardIndex > 0) {
                prevCard();
              } else {
                router.push("/");
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors duration-[var(--duration-micro)] ease-[var(--ease-out)] hover:bg-white"
            aria-label="返回"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>

          <motion.div
            key={group?.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.standard, ease: easing.easeOut }}
            className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm"
          >
            <span className="text-sm">{group?.icon}</span>
            <span className="text-sm font-medium text-foreground/70">{group?.name}</span>
          </motion.div>

          <motion.div
            key={currentCardIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.micro, ease: easing.easeOut }}
            className="text-sm font-medium text-muted-foreground"
          >
            {currentCardIndex + 1}/{CARDS.length}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 overflow-hidden rounded-full bg-orange-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500"
            initial={false}
            animate={{ width: `${progress()}%` }}
            transition={{ duration: duration.standard, ease: easing.easeOut }}
          />
        </div>
      </motion.div>

      {/* Card Content Area */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: duration.emphasis,
              ease: easing.easeOut,
            }}
            className="w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.standard, delay: stagger.fast, ease: easing.easeOut }}
              className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-xl shadow-orange-900/5 backdrop-blur-md"
            >
              <h2 className="mb-1.5 text-xl font-bold text-foreground">
                {currentCard.title}
              </h2>
              {currentCard.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: duration.standard, delay: stagger.standard, ease: easing.easeOut }}
                  className="mb-5 text-sm text-muted-foreground"
                >
                  {currentCard.description}
                </motion.p>
              )}
              {!currentCard.description && <div className="mb-5" />}
              {renderCard(currentCard.id)}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.standard, delay: stagger.slow, ease: easing.easeOut }}
        className="relative z-10 flex gap-3 px-6 pb-8"
      >
        {!currentCard.required && (
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 rounded-2xl text-muted-foreground transition-all duration-[var(--duration-micro)] ease-[var(--ease-out)] hover:bg-muted/50 active:scale-[0.97]"
          >
            跳过
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={currentCard.required && !canProceed()}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-base font-semibold shadow-md shadow-orange-500/20 transition-all duration-[var(--duration-micro)] ease-[var(--ease-out)] hover:shadow-lg active:scale-[0.97] disabled:opacity-40 disabled:shadow-none disabled:active:scale-100"
        >
          {isLastCard() ? "开始起名 ✨" : "下一步"}
        </Button>
      </motion.div>
    </div>
  );
}
