"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import Link from "next/link";
import { BarChart3, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -ml-[39rem] w-[78rem] h-[50rem] opacity-50 pointer-events-none blur-[100px]">
        <div className="absolute inset-0 bg-primary/5 rounded-full" />
      </div>

      <main className="relative pt-32 pb-12 px-6 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-[0.9] text-foreground uppercase">
              The simplest <br />
              <span className="text-foreground/20">
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
                <Button size="lg" className="h-14 px-10 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-base hover:opacity-90 transition-all shadow-xl shadow-foreground/10">
                  <Zap className="w-5 h-5" />
                  Start Polling
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="p-2.5 w-fit rounded-xl bg-foreground/5 border border-border text-foreground">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-[10px] text-foreground/40 italic">Live Results</h3>
                <p className="text-xs text-foreground/60 font-medium">Real-time charts as votes arrive.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="p-2.5 w-fit rounded-xl bg-foreground/5 border border-border text-foreground">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-black uppercase tracking-widest text-[10px] text-foreground/40 italic">Protection</h3>
                <p className="text-xs text-foreground/60 font-medium">Advanced fingerprinting prevents spam.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md -rotate-6 scale-95 opacity-50 pointer-events-none select-none z-0 border-white/5" />
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rotate-3 scale-95 opacity-80 pointer-events-none select-none z-10 border-white/5" />
            
            <Card className="relative w-full max-w-sm ml-auto z-20 shadow-2xl glass border-border bg-background/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
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
        </div>
      </main>
    </div>
  );
}
