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
}: {
  name: GeneratedName;
  surname: string;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div
      className="min-w-0 flex-shrink-0 snap-center px-4"
      style={{ width: "calc(100vw - 2rem)", maxWidth: "calc(28rem - 2rem)" }}
    >
      <div className="rounded-2xl border bg-card p-6 shadow-lg">
        {/* 名字大字展示 */}
        <div className="mb-6 text-center">
          <div className="mb-1 text-4xl font-bold tracking-widest">
            {surname} {name.givenName}
          </div>
          <div className="text-sm text-muted-foreground">{name.pinyin}</div>
        </div>

        {/* 含义 */}
        <div className="mb-4">
          <h3 className="mb-1 text-sm font-semibold text-muted-foreground">
            含义
          </h3>
          <p className="text-sm leading-relaxed">{name.meaning}</p>
        </div>

        {/* 出处 */}
        {name.source && name.source !== "原创" && (
          <div className="mb-4">
            <h3 className="mb-1 text-sm font-semibold text-muted-foreground">
              出处
            </h3>
            <p className="text-sm italic">{name.source}</p>
          </div>
        )}

        {/* 五行 */}
        <div className="mb-4">
          <h3 className="mb-1 text-sm font-semibold text-muted-foreground">
            五行分析
          </h3>
          <p className="text-sm">{name.wuxingAnalysis}</p>
        </div>

        {/* 个人关联 */}
        <div className="mb-6">
          <h3 className="mb-1 text-sm font-semibold text-muted-foreground">
            与您的关联
          </h3>
          <p className="text-sm">{name.personalConnection}</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <Button
            variant={isFavorited ? "default" : "outline"}
            onClick={onToggleFavorite}
            className="flex-1"
          >
            {isFavorited ? "已收藏" : "收藏"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${surname}${name.givenName}`,
                  text: `${surname}${name.givenName} - ${name.meaning}`,
                });
              }
            }}
            className="flex-1"
          >
            分享
          </Button>
        </div>
      </div>
    </div>
  );
}

function LoadingAnimation() {
  const tips = [
    "正在翻阅古诗词典...",
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
    <div className="flex min-h-dvh flex-col items-center justify-center px-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-8 text-5xl"
      >
        ✨
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={tipIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center text-muted-foreground"
        >
          {tips[tipIndex]}
        </motion.p>
      </AnimatePresence>
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
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <div className="px-6 pt-6 text-center">
        <h1 className="text-2xl font-bold">为您推荐</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          左右滑动查看更多名字
        </p>
      </div>

      {/* Name Cards Carousel */}
      <div className="flex flex-1 items-center">
        <div className="flex w-full snap-x snap-mandatory gap-0 overflow-x-auto py-8">
          {generatedNames.map((name) => (
            <NameCard
              key={name.id}
              name={name}
              surname={context.surname || ""}
              isFavorited={favoriteIds.includes(name.id)}
              onToggleFavorite={() => toggleFavorite(name.id)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-3 px-6 pb-8">
        <Button
          variant="outline"
          onClick={() => router.push("/flow")}
          className="flex-1"
        >
          调整条件
        </Button>
        <Button
          onClick={() => {
            setGeneratedNames([]);
            setFetchCount((c) => c + 1);
          }}
          className="flex-1"
        >
          换一批
        </Button>
      </div>
    </div>
  );
}
