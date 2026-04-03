"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const OPTIONS = [
  { label: "Next.js", pct: 65 },
  { label: "SvelteKit", pct: 20 },
  { label: "Remix", pct: 15 },
];

const BADGES = [
  { emoji: "⚡", text: "1 vote cast", delay: 0.8 },
  { emoji: "🔒", text: "Vote recorded", delay: 2.2 },
  { emoji: "📊", text: "Results updated", delay: 3.6 },
];

export function ExamplePollCard() {
  const [activeBadge, setActiveBadge] = useState(0);
  const [barKey, setBarKey] = useState(0);

  useEffect(() => {
    // Cycle toast badges
    const id = setInterval(() => {
      setActiveBadge(v => (v + 1) % BADGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Re-animate bars every 5s
    const id = setInterval(() => setBarKey(k => k + 1), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-10 lg:mt-0"
    >
      {/* Ghost cards for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm -rotate-6 scale-95 h-80 rounded-[2rem] border border-foreground/[0.03] bg-foreground/[0.01] z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rotate-3 scale-97 h-80 rounded-[2rem] border border-foreground/[0.06] bg-foreground/[0.02] z-10" />

      {/* Main card */}
      <div className="relative w-full max-w-sm mx-auto lg:ml-auto z-20 rounded-[2rem] border border-foreground/10 bg-background/80 backdrop-blur-xl shadow-2xl overflow-visible">
        {/* Glowing ring on hover */}
        <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-foreground/10 via-transparent to-foreground/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">Live Poll</p>
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight leading-none italic">
                Favorite framework?
              </h3>
            </div>
            {/* Animated live dot */}
            <div className="flex items-center gap-1.5 bg-foreground/5 border border-foreground/10 rounded-full px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-foreground/50">Live</span>
            </div>
          </div>

          {/* Animated bars */}
          <div className="space-y-3" key={barKey}>
            {OPTIONS.map((opt, i) => (
              <div key={opt.label} className="relative">
                <div className="relative h-11 rounded-xl overflow-hidden bg-foreground/[0.03] border border-foreground/[0.06]">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-foreground/10"
                    initial={{ width: 0 }}
                    animate={{ width: `${opt.pct}%` }}
                    transition={{ duration: 1.2, delay: 0.4 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <span className="font-black text-foreground uppercase text-[10px] tracking-widest">{opt.label}</span>
                    <motion.span
                      className="font-black text-foreground/50 text-xs tabular-nums"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                    >
                      {opt.pct}%
                    </motion.span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total votes counter */}
          <motion.div
            className="mt-5 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/25">Total votes</span>
            <CountUp to={2847} className="text-[9px] font-black uppercase tracking-widest text-foreground/40 tabular-nums" />
          </motion.div>
        </div>
      </div>

      {/* Floating toast badges */}
      <div className="absolute -bottom-4 -left-4 z-30">
        {BADGES.map((badge, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={activeBadge === i ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 flex items-center gap-2 bg-background/95 border border-foreground/10 backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-2xl whitespace-nowrap"
          >
            <span>{badge.emoji}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">{badge.text}</span>
          </motion.div>
        ))}
      </div>

      {/* Floating top-right decoration */}
      <motion.div
        className="absolute -top-4 -right-4 z-30 flex items-center gap-2 bg-background/95 border border-foreground/10 backdrop-blur-xl rounded-2xl px-4 py-2.5 shadow-2xl"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">🚀 Instant results</span>
      </motion.div>
    </motion.div>
  );
}

function CountUp({ to, className }: { to: number; className?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setValue(to); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [to]);
  return <span className={className}>{value.toLocaleString()} votes</span>;
}
