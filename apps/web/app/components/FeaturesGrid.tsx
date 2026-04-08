"use client";

import { motion } from "framer-motion";

export function FeaturesGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-12 grid grid-cols-2 gap-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h3 className="font-black uppercase tracking-widest text-[10px] text-foreground/80 italic">
          Live Results
        </h3>
        <p className="text-xs text-foreground/60 font-medium">
          Real-time charts as votes arrive.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h3 className="font-black uppercase tracking-widest text-[10px] text-foreground/80 italic">
          Security
        </h3>
        <p className="text-xs text-foreground/60 font-medium">
          Advanced fingerprinting prevents spam.
        </p>
      </motion.div>
    </motion.div>
  );
}