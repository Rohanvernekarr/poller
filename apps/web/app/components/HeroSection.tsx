"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

function StatCounter({ value, suffix, loading }: { value: number; suffix: string; loading: boolean }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (loading || value === 0) return;
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, loading]);

  if (loading) return <span className="tabular-nums opacity-30">—</span>;
  return (
    <span className="tabular-nums">
      {display >= 1000 ? `${(display / 1000).toFixed(display >= 10000 ? 0 : 1)}k` : display}
      {suffix}
    </span>
  );
}

const WORDS = ["Polls", "Surveys", "Votes", "Feedback", "Decisions"];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [stats, setStats] = useState({ polls: 0, votes: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setWordIndex(i => (i + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const STATS = [
    { value: stats.polls, label: "Polls Created", suffix: "+", isLive: true },
    { value: stats.votes, label: "Votes Cast", suffix: "+", isLive: true },
    { value: stats.users, label: "Users", suffix: "+", isLive: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="text-5xl sm:text-6xl font-black mb-6 leading-[0.95] text-foreground uppercase">
        The simplest <br />
        <span className="text-foreground/25">way to gather</span>
        <br />
        <span className="inline-block relative">
          <span className="relative inline-block overflow-hidden h-[1.1em] align-bottom">
            {WORDS.map((word, i) => (
              <motion.span
                key={word}
                className="absolute left-0"
                initial={{ y: "100%", opacity: 0 }}
                animate={
                  i === wordIndex
                    ? { y: "0%", opacity: 1 }
                    : i === (wordIndex - 1 + WORDS.length) % WORDS.length
                    ? { y: "-100%", opacity: 0 }
                    : { y: "100%", opacity: 0 }
                }
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
            <span className="invisible">{WORDS.reduce((a, b) => (a.length > b.length ? a : b))}</span>
          </span>
        </span>
      </h1>

      <p className="text-lg text-foreground/40 mb-10 max-w-md font-medium leading-relaxed">
        Create beautiful, fast, and secure polls in seconds. Share the link and watch results roll in real-time.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-14">
        <Link href="/create">
          <Button
            size="lg"
            className="h-14 px-10 gap-2 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-foreground/10 group"
          >
            <Zap className="w-4 h-4 group-hover:animate-pulse" />
            Start Polling
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            size="lg"
            variant="ghost"
            className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-sm border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/5 transition-all"
          >
            View Dashboard
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid grid-cols-3 gap-6 pt-8 border-t border-foreground/[0.06]"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
            className="flex flex-col gap-1"
          >
            <span className="text-2xl font-black text-foreground leading-none">
              <StatCounter value={stat.value} suffix={stat.suffix} loading={stat.isLive && loading} />
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/30">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
