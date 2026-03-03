"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { cn } from "@/lib/utils";
import { easing, duration, stagger } from "@/lib/motion";

export function MultiSelectCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const selected = (context[config.field] as string[]) || [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : selected.length < 3
        ? [...selected, value]
        : selected;
    updateContext(config.field as keyof UserContext, next);
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {config.options?.map((option, index) => {
        const isSelected = selected.includes(option.value);
        return (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: duration.standard / 1000,
              delay: index * stagger.fast,
              ease: easing.easeOut,
            }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggle(option.value)}
            className={cn(
              "relative rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all duration-[var(--duration-micro)] ease-[var(--ease-out)]",
              isSelected
                ? "border-orange-400 bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-sm shadow-orange-500/20"
                : "border-border bg-muted/20 hover:border-orange-300 hover:bg-orange-50/50"
            )}
          >
            <span>{option.label}</span>
            <AnimatePresence>
              {isSelected && (
                <motion.span
                  initial={{ opacity: 0, scale: 0, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto" }}
                  exit={{ opacity: 0, scale: 0, width: 0 }}
                  transition={{ duration: duration.micro / 1000, ease: easing.bouncy }}
                  className="ml-1 inline-block text-xs"
                >
                  ✓
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
