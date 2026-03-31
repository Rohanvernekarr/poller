"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@repo/ui/card";

export function ExamplePollCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative mt-10 lg:mt-0"
    >
      {/* Visual background cards for depth */}
      <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md -rotate-6 scale-95 opacity-50 pointer-events-none select-none z-0 border-white/5" />
      <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rotate-3 scale-95 opacity-80 pointer-events-none select-none z-10 border-white/5" />
      
      <Card className="relative w-full max-w-sm mx-auto lg:ml-auto z-20 shadow-2xl glass border-border bg-background/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
        <CardContent className="p-8">
          <h3 className="text-xl font-black mb-6 text-foreground uppercase tracking-tight leading-none italic">Favorite framework?</h3>
          <div className="space-y-4">
            <div className="relative h-12 rounded-xl border-border flex items-center px-4 cursor-pointer hover:bg-foreground/5 transition-colors">
              <div className="absolute inset-y-0 left-0 bg-foreground/10 w-[65%]" />
              <span className="relative z-10 font-black text-foreground uppercase text-[10px] tracking-widest">Next.js</span>
              <span className="relative z-10 ml-auto font-black text-foreground/60 text-xs">65%</span>
            </div>
            <div className="relative h-12 rounded-xl border-border flex items-center px-4 cursor-pointer hover:bg-foreground/5 transition-colors">
              <div className="absolute inset-y-0 left-0 bg-foreground/5 w-[20%]" />
              <span className="relative z-10 font-black text-foreground uppercase text-[10px] tracking-widest">SvelteKit</span>
              <span className="relative z-10 ml-auto font-black text-foreground/20 text-xs">20%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
