"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl sm:text-6xl font-black mb-10 leading-[0.9] text-foreground uppercase">
        The simplest <br />
        <span className="text-foreground/30">
          way to gather 
        </span> <br />
        opinions
      </h1>
      <p className="text-xl text-foreground/40 mb-10 max-w-lg font-medium leading-relaxed">
        Create beautiful, fast, and secure polls in seconds. Share the link
        and watch the results roll in real-time. 
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/create">
          <Button size="lg" className="h-14 px-10 gap-2 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-base hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-foreground/10">
            <Zap className="w-5 h-5" />
            Start Polling
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
