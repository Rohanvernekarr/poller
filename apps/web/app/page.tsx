"use client";

import { HeroSection } from "./components/HeroSection";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { ExamplePollCard } from "./components/ExamplePollCard";
import { AnimatedBackground } from "./components/AnimatedBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedBackground />

      <main className="relative z-10 pt-32 pb-12 px-6 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:items-start items-start">
          <div>
            <HeroSection />
            <FeaturesGrid />
          </div>
          <div className="lg:pt-20">
            <ExamplePollCard />
          </div>
        </div>
      </main>
    </div>
  );
}
