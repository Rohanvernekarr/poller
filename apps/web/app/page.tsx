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

      <main className="relative pt-32 pb-16 px-6 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-foreground">
              The simplest way to <br />
              <span>
                gather opinions
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-lg">
              Create beautiful, fast, and secure polls in seconds. Share the link
              and watch the results roll in real-time. 
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create">
                <Button size="lg" className="w-full sm:w-auto px-8 font-semibold text-lg gap-2">
                  <Zap className="w-5 h-5" />
                  Start Polling Now
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <div className="p-3 w-fit rounded-xl bg-foreground/5 border border-foreground/10 text-primary">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground">Live Results</h3>
                <p className="text-sm text-gray-500">Watch the votes come in real-time with beautiful charts.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="p-3 w-fit rounded-xl bg-foreground/5 border border-foreground/10 text-secondary">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground">Spam Protection</h3>
                <p className="text-sm text-gray-500">Advanced browser fingerprinting keeps your polls fair.</p>
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
            
            <Card className="relative w-full max-w-md mx-auto z-20 shadow-2xl glass border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-foreground">What's your favorite framework?</h3>
                <div className="space-y-4">
                  <div className="relative h-14 rounded-xl overflow-hidden glass border-foreground/20 flex items-center px-4 cursor-pointer hover:bg-foreground/5 transition-colors">
                    <div className="absolute inset-y-0 left-0 bg-foreground/10 w-[65%]" />
                    <span className="relative z-10 font-medium text-foreground">Next.js</span>
                    <span className="relative z-10 ml-auto font-bold text-foreground">65%</span>
                  </div>
                  <div className="relative h-14 rounded-xl overflow-hidden glass border-border flex items-center px-4 cursor-pointer hover:bg-foreground/5 transition-colors">
                    <div className="absolute inset-y-0 left-0 bg-foreground/5 w-[20%]" />
                    <span className="relative z-10 font-medium text-foreground">SvelteKit</span>
                    <span className="relative z-10 ml-auto font-bold text-gray-400">20%</span>
                  </div>
                  <div className="relative h-14 rounded-xl overflow-hidden glass border-border flex items-center px-4 cursor-pointer hover:bg-foreground/5 transition-colors">
                    <div className="absolute inset-y-0 left-0 bg-foreground/5 w-[15%]" />
                    <span className="relative z-10 font-medium text-foreground">Nuxt</span>
                    <span className="relative z-10 ml-auto font-bold text-gray-400">15%</span>
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
