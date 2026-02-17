"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useFlowStore } from "@/stores/flow-store";
import { GeneratedName } from "@/lib/types";
import { Button } from "@/components/ui/button";

function NameCard({
  name,
  surname,
  isFavorited,
  onToggleFavorite,
  index,
}: {
  name: GeneratedName;
  surname: string;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  index: number;
}) {
  // 每张卡片一个渐变色
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
      className="min-w-0 flex-shrink-0 snap-center px-3"
      style={{ width: "calc(100vw - 2rem)", maxWidth: "calc(28rem - 2rem)" }}
    >
      <div className={`rounded-3xl border ${border} bg-gradient-to-b ${gradient} p-6 shadow-lg`}>
        {/* 名字大字展示 */}
        <div className="mb-6 text-center">
          <div className={`mb-2 text-4xl font-bold tracking-[0.2em] ${accent}`}>
            {surname}{name.givenName}
          </div>
          <div className="text-sm text-muted-foreground tracking-wider">{name.pinyin}</div>
        </div>

        {/* 分割线 */}
        <div className="mx-auto mb-5 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* 含义 */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="text-xs">💡</span>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              含义
            </h3>
          </div>
          <p className="text-sm leading-relaxed">{name.meaning}</p>
        </div>

        {/* 出处 */}
        {name.source && name.source !== "原创" && (
          <div className="mb-4">
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="text-xs">📖</span>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                出处
              </h3>
            </div>
            <p className="text-sm italic text-muted-foreground">{name.source}</p>
          </div>
        )}

        {/* 五行 */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="text-xs">🔮</span>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              五行分析
            </h3>
          </div>
          <p className="text-sm">{name.wuxingAnalysis}</p>
        </div>

        {/* 个人关联 */}
        <div className="mb-6">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="text-xs">🎯</span>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              与您的关联
            </h3>
          </div>
          <p className="text-sm">{name.personalConnection}</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onToggleFavorite}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium transition-all active:scale-95 ${
              isFavorited
                ? "bg-orange-500 text-white shadow-sm"
                : "border-2 border-border bg-white/80 hover:border-orange-300"
            }`}
          >
            {isFavorited ? "❤️ 已收藏" : "🤍 收藏"}
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${surname}${name.givenName}`,
                  text: `${surname}${name.givenName} - ${name.meaning}`,
                });
              }
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-white/80 py-3 text-sm font-medium transition-all hover:border-orange-300 active:scale-95"
          >
            📤 分享
          </button>
        </div>
      </div>
    </div>
  );
}

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
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-br from-orange-200/50 to-amber-100/30 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* 书写动画 */}
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

        {/* 进度点 */}
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
  const [fetchCount, setFetchCount] = useState(0);
  const hasFetched = useRef(false);

  const generate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });
      const data = await res.json();
      if (data.names) {
        setGeneratedNames(data.names);
      }
    } catch (err) {
      console.error("Failed to generate names:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [context, setGeneratedNames, setIsGenerating]);

  useEffect(() => {
    if (!context.surname) {
      router.push("/");
      return;
    }
    if (!hasFetched.current || fetchCount > 0) {
      hasFetched.current = true;
      generate();
    }
  }, [context.surname, fetchCount, generate, router]);

  if (isGenerating || generatedNames.length === 0) {
    return <LoadingAnimation />;
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* 背景 */}
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
          左右滑动查看 {generatedNames.length} 个名字
        </motion.p>

        {/* 滑动指示器 */}
        <div className="mt-4 flex justify-center gap-1.5">
          {generatedNames.map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-6 rounded-full bg-orange-200"
            />
          ))}
        </div>
      </div>

      {/* Name Cards Carousel */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="scrollbar-hide flex w-full snap-x snap-mandatory gap-0 overflow-x-auto py-6">
          {generatedNames.map((name, i) => (
            <NameCard
              key={name.id}
              name={name}
              surname={context.surname || ""}
              isFavorited={favoriteIds.includes(name.id)}
              onToggleFavorite={() => toggleFavorite(name.id)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 flex gap-3 px-6 pb-8">
        <Button
          variant="outline"
          onClick={() => router.push("/flow")}
          className="flex-1 h-12 rounded-2xl border-2"
        >
          调整条件
        </Button>
        <Button
          onClick={() => {
            setGeneratedNames([]);
            setFetchCount((c) => c + 1);
          }}
          className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold shadow-md shadow-orange-500/20 transition-all hover:shadow-lg active:scale-[0.98]"
        >
          换一批 ✨
        </Button>
      </div>
    </div>
  );
}
