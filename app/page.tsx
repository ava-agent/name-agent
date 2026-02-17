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
    <div className="flex min-h-dvh flex-col items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Logo / Title */}
        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">
            AI 起名
          </h1>
          <p className="text-lg text-muted-foreground">让名字有故事</p>
        </div>

        {/* Description */}
        <div className="mb-12 space-y-3 text-sm text-muted-foreground">
          <p>回答几个简单的问题</p>
          <p>AI 为宝宝起一个有意义的名字</p>
        </div>

        {/* CTA */}
        <Button onClick={handleStart} size="lg" className="h-14 w-full text-lg">
          开始起名
        </Button>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
          <div>
            <div className="mb-1 text-2xl">🎴</div>
            <span>卡片式交互</span>
          </div>
          <div>
            <div className="mb-1 text-2xl">🎤</div>
            <span>语音输入</span>
          </div>
          <div>
            <div className="mb-1 text-2xl">🤖</div>
            <span>AI 深度理解</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
