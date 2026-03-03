"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/stores/flow-store";
import { easing, duration, stagger, spring } from "@/lib/motion";

export default function HomePage() {
  const router = useRouter();
  const { resetFlow, updateContext } = useFlowStore();
  const [quickSurname, setQuickSurname] = useState("");
  const [quickGender, setQuickGender] = useState<"boy" | "girl" | "neutral">("boy");

  const handleStart = () => {
    resetFlow();
    router.push("/flow");
  };

  const handleQuickGenerate = () => {
    const surname = quickSurname.trim();
    if (!surname) return;
    resetFlow();
    updateContext("surname", surname);
    updateContext("gender", quickGender);
    router.push("/result");
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8">
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duration.brand, ease: easing.easeOut }}
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-orange-200/40 to-amber-100/30 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: duration.brand, delay: 0.1, ease: easing.easeOut }}
          className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-200/30 to-orange-100/20 blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full text-center">
        {/* Logo - Hero Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            ...spring.bouncy,
            delay: 0.1,
          }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/25"
        >
          <span className="text-4xl">名</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.standard, delay: 0.25, ease: easing.easeOut }}
          className="mb-2 text-3xl font-bold tracking-tight"
        >
          AI 起名
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.standard, delay: 0.35, ease: easing.easeOut }}
          className="mb-10 text-base text-muted-foreground"
        >
          让每个名字都有故事
        </motion.p>

        {/* Steps - Staggered Reveal */}
        <div className="mb-10 space-y-4">
          {[
            { icon: "1", text: "回答几个简单的问题" },
            { icon: "2", text: "AI 深度理解你的期望" },
            { icon: "3", text: "为宝宝起一个有意义的名字" },
          ].map((item, index) => (
            <motion.div
              key={item.icon}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: duration.emphasis,
                delay: 0.4 + index * stagger.standard,
                ease: easing.easeOut,
              }}
              className="flex items-center gap-4 text-left"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: duration.micro, ease: easing.iOS }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-sm font-bold text-white"
              >
                {item.icon}
              </motion.div>
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.standard, delay: 0.7, ease: easing.easeOut }}
        >
          <Button
            onClick={handleStart}
            size="lg"
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-lg font-semibold shadow-lg shadow-orange-500/25 transition-shadow duration-[var(--duration-micro)] ease-[var(--ease-out)] hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.97]"
          >
            开始起名
          </Button>
        </motion.div>

        {/* Quick Generate - Secondary Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.standard, delay: 0.85, ease: easing.easeOut }}
          className="mt-6"
        >
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: duration.standard, delay: 0.9, ease: easing.easeOut }}
              className="h-px flex-1 origin-left bg-border"
            />
            <span className="text-xs text-muted-foreground/60">或者，快速生成</span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: duration.standard, delay: 0.9, ease: easing.easeOut }}
              className="h-px flex-1 origin-right bg-border"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.standard, delay: 1.0, ease: easing.easeOut }}
            className="mt-3 flex gap-2"
          >
            <input
              aria-label="姓氏"
              value={quickSurname}
              onChange={(e) => setQuickSurname(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickGenerate()}
              placeholder="输入姓氏"
              maxLength={10}
              className="h-11 w-28 rounded-xl border-2 border-border bg-white/80 px-4 text-base transition-all duration-[var(--duration-micro)] ease-[var(--ease-out)] focus:border-orange-400 focus:bg-white focus:outline-none"
            />
            <select
              aria-label="性别"
              value={quickGender}
              onChange={(e) => setQuickGender(e.target.value as "boy" | "girl" | "neutral")}
              className="h-11 rounded-xl border-2 border-border bg-white/80 px-2 text-sm transition-all duration-[var(--duration-micro)] ease-[var(--ease-out)] focus:border-orange-400 focus:bg-white focus:outline-none"
            >
              <option value="boy">男孩</option>
              <option value="girl">女孩</option>
              <option value="neutral">不限</option>
            </select>
            <Button
              onClick={handleQuickGenerate}
              disabled={!quickSurname.trim()}
              className="h-11 flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 font-medium shadow-sm transition-all duration-[var(--duration-micro)] ease-[var(--ease-out)] hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100"
            >
              马上起名
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Pills - Subtle Entry */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.emphasis, delay: 1.1, ease: easing.easeOut }}
          className="mt-10 grid grid-cols-3 gap-3"
        >
          {[
            { icon: "🎴", label: "卡片交互" },
            { icon: "🎤", label: "语音输入" },
            { icon: "🤖", label: "AI 理解" },
          ].map((f, index) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: duration.standard,
                delay: 1.15 + index * stagger.fast,
                ease: easing.easeOut,
              }}
              whileHover={{ y: -2, transition: { duration: duration.micro, ease: easing.iOS } }}
              className="cursor-default rounded-2xl bg-white/60 px-3 py-4 text-center shadow-sm backdrop-blur-sm transition-shadow duration-[var(--duration-micro)] hover:shadow-md"
            >
              <div className="mb-1.5 text-xl">{f.icon}</div>
              <span className="text-xs text-muted-foreground">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
