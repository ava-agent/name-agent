"use client";

import { motion } from "framer-motion";
import { useFlowStore } from "@/stores/flow-store";
import { CardConfig, UserContext } from "@/lib/types";
import { cn } from "@/lib/utils";
import { easing, duration, stagger } from "@/lib/motion";

export function SelectCard({ config }: { config: CardConfig }) {
  const { context, updateContext } = useFlowStore();
  const value = context[config.field] as string;

  return (
    <div className="flex flex-col gap-3">
      {config.options?.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: duration.standard,
              delay: index * stagger.fast,
              ease: easing.easeOut,
            }}
            whileHover={{ scale: 1.01, x: 3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              updateContext(config.field as keyof UserContext, option.value)
            }
            className={cn(
              "relative rounded-2xl border-2 px-6 py-4 text-left text-lg font-medium transition-all duration-[var(--duration-micro)] ease-[var(--ease-out)]",
              isSelected
                ? "border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 shadow-sm"
                : "border-border bg-muted/20 hover:border-orange-300 hover:bg-orange-50/50"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId={`select-${config.field}`}
                className="absolute inset-0 rounded-2xl border-2 border-orange-400"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
            {isSelected && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: duration.micro, ease: easing.bouncy }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500"
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
