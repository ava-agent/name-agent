"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/stores/flow-store";

export default function HomePage() {
  const router = useRouter();
  const resetFlow = useFlowStore((s) => s.resetFlow);

  const handleStart = () => {
    resetFlow();
    router.push("/flow");
  };

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8">
      {/* 背景装饰 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-orange-200/40 to-amber-100/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-200/30 to-orange-100/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg shadow-orange-500/25"
        >
          <span className="text-4xl">名</span>
        </motion.div>

        {/* Title */}
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          AI 起名
        </h1>
        <p className="mb-10 text-base text-muted-foreground">
          让每个名字都有故事
        </p>

        {/* Description */}
        <div className="mb-10 space-y-4">
          {[
            { icon: "1", text: "回答几个简单的问题", delay: 0.3 },
            { icon: "2", text: "AI 深度理解你的期望", delay: 0.4 },
            { icon: "3", text: "为宝宝起一个有意义的名字", delay: 0.5 },
          ].map((item) => (
            <motion.div
              key={item.icon}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: item.delay }}
              className="flex items-center gap-4 text-left"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-sm font-bold text-white">
                {item.icon}
              </div>
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            onClick={handleStart}
            size="lg"
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-lg font-semibold shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98]"
          >
            开始起名
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 grid grid-cols-3 gap-3"
        >
          {[
            { icon: "🎴", label: "卡片交互" },
            { icon: "🎤", label: "语音输入" },
            { icon: "🤖", label: "AI 理解" },
          ].map((f) => (
            <div
              key={f.label}
              className="rounded-2xl bg-white/60 px-3 py-4 text-center shadow-sm backdrop-blur-sm"
            >
              <div className="mb-1.5 text-xl">{f.icon}</div>
              <span className="text-xs text-muted-foreground">{f.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
