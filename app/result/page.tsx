"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate as animateValue,
  PanInfo,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useFlowStore } from "@/stores/flow-store";
import { GeneratedName } from "@/lib/types";
import { Button } from "@/components/ui/button";

/* ─────────── Name Card Content (shared between swipe & summary) ─────────── */

function NameCardContent({
  name,
  surname,
  index,
}: {
  name: GeneratedName;
  surname: string;
  index: number;
}) {
  const gradients = [
    "from-orange-50 to-amber-50",
    "from-rose-50 to-pink-50",
    "from-sky-50 to-blue-50",
    "from-emerald-50 to-teal-50",
    "from-violet-50 to-purple-50",
  ];
  const accentColors = [
    "text-orange-600",
    "text-rose-600",
    "text-sky-600",
    "text-emerald-600",
    "text-violet-600",
  ];
  const borderColors = [
    "border-orange-200",
    "border-rose-200",
    "border-sky-200",
    "border-emerald-200",
    "border-violet-200",
  ];

  const gradient = gradients[index % gradients.length];
  const accent = accentColors[index % accentColors.length];
  const border = borderColors[index % borderColors.length];

  return (
    <div
      className={`rounded-3xl border ${border} bg-gradient-to-b ${gradient} p-6 shadow-2xl`}
    >
      {/* Name */}
      <div className="mb-5 pt-2 text-center">
        <div
          className={`mb-2 text-4xl font-bold tracking-[0.2em] ${accent}`}
        >
          {surname}
          {name.givenName}
        </div>
        <div className="text-sm tracking-wider text-muted-foreground">
          {name.pinyin}
        </div>
      </div>

      <div className="mx-auto mb-4 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Meaning */}
      <div className="mb-3">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-xs">💡</span>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            含义
          </h3>
        </div>
        <p className="text-sm leading-relaxed">{name.meaning}</p>
      </div>

      {/* Source */}
      {name.source && name.source !== "原创" && (
        <div className="mb-3">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-xs">📖</span>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              出处
            </h3>
          </div>
          <p className="text-sm italic text-muted-foreground">{name.source}</p>
        </div>
      )}

      {/* Wuxing */}
      <div className="mb-3">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-xs">🔮</span>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            五行分析
          </h3>
        </div>
        <p className="text-sm">{name.wuxingAnalysis}</p>
      </div>

      {/* Personal connection */}
      <div>
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-xs">🎯</span>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            与您的关联
          </h3>
        </div>
        <p className="text-sm">{name.personalConnection}</p>
      </div>
    </div>
  );
}

/* ─────────── Swipeable Top Card ─────────── */

function SwipeableCard({
  name,
  surname,
  index,
  onSwipeComplete,
}: {
  name: GeneratedName;
  surname: string;
  index: number;
  onSwipeComplete: (direction: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);
  const swiping = useRef(false);

  const handleDragEnd = async (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (swiping.current) return;
    const threshold = 80;
    const velocityThreshold = 400;

    if (
      info.offset.x > threshold ||
      info.velocity.x > velocityThreshold
    ) {
      swiping.current = true;
      await animateValue(x, 500, { duration: 0.3, ease: "easeOut" });
      onSwipeComplete("right");
    } else if (
      info.offset.x < -threshold ||
      info.velocity.x < -velocityThreshold
    ) {
      swiping.current = true;
      await animateValue(x, -500, { duration: 0.3, ease: "easeOut" });
      onSwipeComplete("left");
    } else {
      animateValue(x, 0, {
        type: "spring",
        stiffness: 500,
        damping: 30,
      });
    }
  };

  // Button-triggered swipe
  const triggerSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (swiping.current) return;
      swiping.current = true;
      await animateValue(x, direction === "right" ? 500 : -500, {
        duration: 0.35,
        ease: "easeOut",
      });
      onSwipeComplete(direction);
    },
    [x, onSwipeComplete]
  );

  // Expose triggerSwipe via ref
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__swipeTrigger =
      triggerSwipe;
    return () => {
      delete (window as unknown as Record<string, unknown>).__swipeTrigger;
    };
  }, [triggerSwipe]);

  return (
    <motion.div
      className="absolute inset-x-0 top-0 z-10 cursor-grab touch-none active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
    >
      {/* Like stamp */}
      <motion.div
        className="absolute left-5 top-5 z-20 -rotate-12 rounded-xl border-[3px] border-green-500 bg-green-500/10 px-3 py-1.5"
        style={{ opacity: likeOpacity }}
      >
        <span className="text-lg font-black text-green-500">收藏 ❤️</span>
      </motion.div>

      {/* Nope stamp */}
      <motion.div
        className="absolute right-5 top-5 z-20 rotate-12 rounded-xl border-[3px] border-gray-400 bg-gray-400/10 px-3 py-1.5"
        style={{ opacity: nopeOpacity }}
      >
        <span className="text-lg font-black text-gray-400">跳过 ✕</span>
      </motion.div>

      <NameCardContent name={name} surname={surname} index={index} />

      {/* Swipe hint */}
      <div className="mt-3 flex items-center justify-center gap-8 text-xs text-muted-foreground/50">
        <span>← 跳过</span>
        <span>收藏 →</span>
      </div>
    </motion.div>
  );
}

/* ─────────── Stack Card (non-interactive, behind top) ─────────── */

function StackCard({
  name,
  surname,
  index,
  stackPosition,
}: {
  name: GeneratedName;
  surname: string;
  index: number;
  stackPosition: number; // 1, 2, ...
}) {
  return (
    <motion.div
      className="absolute inset-x-0 top-0"
      style={{ zIndex: 10 - stackPosition }}
      animate={{
        scale: 1 - stackPosition * 0.05,
        y: stackPosition * 14,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <NameCardContent name={name} surname={surname} index={index} />
    </motion.div>
  );
}

/* ─────────── Loading Animation ─────────── */

function LoadingAnimation() {
  const tips = [
    "翻阅古诗词典...",
    "参考五行八字...",
    "融合家庭背景...",
    "斟酌每一个字...",
    "寻找最美的寓意...",
  ];
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-200/50 to-amber-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="mb-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-xl shadow-orange-500/25"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="text-5xl">✍️</span>
        </motion.div>

        <div className="mb-6 flex gap-2">
          {tips.map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full"
              animate={{
                width: i === tipIndex ? 24 : 8,
                backgroundColor: i === tipIndex ? "#f97316" : "#fed7aa",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center text-base text-muted-foreground"
          >
            {tips[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────── Summary View (after all cards swiped) ─────────── */

function SummaryView({
  names,
  surname,
  favoriteIds,
  onRegenerate,
  onAdjust,
}: {
  names: GeneratedName[];
  surname: string;
  favoriteIds: string[];
  onRegenerate: () => void;
  onAdjust: () => void;
}) {
  const favorites = names.filter((n) => favoriteIds.includes(n.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex min-h-dvh flex-col px-6 pt-10 pb-8"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-10 h-48 w-48 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute -left-20 bottom-20 h-56 w-56 rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex-1">
        <h2 className="mb-2 text-center text-2xl font-bold">
          浏览完毕
        </h2>

        {favorites.length > 0 ? (
          <>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              您收藏了 {favorites.length} 个名字
            </p>
            <div className="space-y-3">
              {favorites.map((name, i) => (
                <motion.div
                  key={name.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4"
                >
                  <div className="text-2xl font-bold text-orange-600">
                    {surname}
                    {name.givenName}
                  </div>
                  <div className="flex-1 text-xs text-muted-foreground line-clamp-2">
                    {name.meaning}
                  </div>
                  <span className="text-lg">❤️</span>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <p className="mb-6 text-center text-sm text-muted-foreground">
            您没有收藏任何名字，试试换一批？
          </p>
        )}
      </div>

      <div className="relative z-10 flex gap-3 pt-6">
        <Button
          variant="outline"
          onClick={onAdjust}
          className="h-12 flex-1 rounded-2xl border-2"
        >
          调整条件
        </Button>
        <Button
          onClick={onRegenerate}
          className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold shadow-md shadow-orange-500/20 transition-all hover:shadow-lg active:scale-[0.98]"
        >
          换一批 ✨
        </Button>
      </div>
    </motion.div>
  );
}

/* ─────────── Error View ─────────── */

function ErrorView({
  message,
  onRetry,
  onAdjust,
}: {
  message: string;
  onRetry: () => void;
  onAdjust: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-8">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100">
        <span className="text-4xl">😔</span>
      </div>
      <h2 className="mb-2 text-xl font-bold">生成失败</h2>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        {message}
      </p>
      <div className="flex w-full gap-3">
        <Button
          variant="outline"
          onClick={onAdjust}
          className="h-12 flex-1 rounded-2xl border-2"
        >
          返回调整
        </Button>
        <Button
          onClick={onRetry}
          className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold shadow-md"
        >
          重试
        </Button>
      </div>
    </div>
  );
}

/* ─────────── Main Result Page ─────────── */

export default function ResultPage() {
  const router = useRouter();
  const {
    context,
    generatedNames,
    setGeneratedNames,
    isGenerating,
    setIsGenerating,
    favoriteIds,
    toggleFavorite,
  } = useFlowStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const contextRef = useRef(context);
  contextRef.current = context;
  const hasFetched = useRef(false);

  const generate = useCallback(async () => {
    setIsGenerating(true);
    setError("");
    setCurrentIndex(0);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: contextRef.current }),
      });
      const data = await res.json();
      if (data.names) {
        setGeneratedNames(data.names);
      } else {
        setError(data.error || "生成失败，请重试");
      }
    } catch {
      setError("网络错误，请检查网络后重试");
    } finally {
      setIsGenerating(false);
    }
  }, [setGeneratedNames, setIsGenerating]);

  // Initial fetch
  useEffect(() => {
    if (!context.surname) {
      router.push("/");
      return;
    }
    if (!hasFetched.current) {
      hasFetched.current = true;
      generate();
    }
  }, [context.surname, generate, router]);

  // Handle swipe
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "right" && generatedNames[currentIndex]) {
        toggleFavorite(generatedNames[currentIndex].id);
      }
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, generatedNames, toggleFavorite]
  );

  // Button swipe triggers
  const handleButtonSwipe = useCallback(
    (direction: "left" | "right") => {
      const trigger = (
        window as unknown as Record<
          string,
          ((d: "left" | "right") => void) | undefined
        >
      ).__swipeTrigger;
      if (trigger) {
        trigger(direction);
      } else {
        handleSwipe(direction);
      }
    },
    [handleSwipe]
  );

  // Regenerate
  const handleRegenerate = useCallback(() => {
    setGeneratedNames([]);
    generate();
  }, [generate, setGeneratedNames]);

  // ─── Render states ───

  if (isGenerating) {
    return <LoadingAnimation />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={generate}
        onAdjust={() => router.push("/flow")}
      />
    );
  }

  if (generatedNames.length === 0) {
    return <LoadingAnimation />;
  }

  const allSwiped = currentIndex >= generatedNames.length;

  if (allSwiped) {
    return (
      <SummaryView
        names={generatedNames}
        surname={context.surname || ""}
        favoriteIds={favoriteIds}
        onRegenerate={handleRegenerate}
        onAdjust={() => router.push("/flow")}
      />
    );
  }

  // ─── Swipe card stack view ───

  const remaining = generatedNames.slice(currentIndex);
  const visibleStack = remaining.slice(0, 3);

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-10 h-48 w-48 rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute -left-20 bottom-20 h-56 w-56 rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
        >
          为您推荐
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-1.5 text-sm text-muted-foreground"
        >
          左右滑动选择 · {currentIndex + 1}/{generatedNames.length}
        </motion.p>

        {/* Progress dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {generatedNames.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full"
              animate={{
                width: i === currentIndex ? 20 : 8,
                backgroundColor:
                  i < currentIndex
                    ? favoriteIds.includes(generatedNames[i].id)
                      ? "#f97316"
                      : "#d1d5db"
                    : i === currentIndex
                      ? "#f97316"
                      : "#fed7aa",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-4">
        <div className="relative w-full" style={{ minHeight: 420 }}>
          {/* Render in reverse order so top card is last (z-index on top) */}
          {[...visibleStack].reverse().map((name, reverseIdx) => {
            const stackPos = visibleStack.length - 1 - reverseIdx;
            const actualIndex = currentIndex + stackPos;
            const isTop = stackPos === 0;

            if (isTop) {
              return (
                <SwipeableCard
                  key={name.id}
                  name={name}
                  surname={context.surname || ""}
                  index={actualIndex}
                  onSwipeComplete={handleSwipe}
                />
              );
            }

            return (
              <StackCard
                key={name.id}
                name={name}
                surname={context.surname || ""}
                index={actualIndex}
                stackPosition={stackPos}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="relative z-10 px-6 pb-8">
        <div className="mb-4 flex items-center justify-center gap-6">
          {/* Skip button */}
          <button
            onClick={() => handleButtonSwipe("left")}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-md transition-all active:scale-90"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Share button */}
          <button
            onClick={() => {
              const name = generatedNames[currentIndex];
              if (navigator.share && name) {
                navigator.share({
                  title: `${context.surname}${name.givenName}`,
                  text: `${context.surname}${name.givenName} - ${name.meaning}`,
                });
              }
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-sky-200 bg-white shadow-sm transition-all active:scale-90"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          {/* Favorite button */}
          <button
            onClick={() => handleButtonSwipe("right")}
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-orange-200 bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/25 transition-all active:scale-90"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Adjust conditions link */}
        <button
          onClick={() => router.push("/flow")}
          className="mx-auto block text-xs text-muted-foreground/60 underline-offset-2 hover:underline"
        >
          调整条件
        </button>
      </div>
    </div>
  );
}
