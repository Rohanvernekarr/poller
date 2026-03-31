"use client";

import { HeroSection } from "./components/HeroSection";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { ExamplePollCard } from "./components/ExamplePollCard";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -ml-[39rem] w-[78rem] h-[50rem] opacity-50 pointer-events-none blur-[100px]">
        <div className="absolute inset-0 bg-primary/5 rounded-full" />
      </div>

      <main className="relative pt-32 pb-12 px-6 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <HeroSection />
            <FeaturesGrid />
          </div>
          <ExamplePollCard />
        </div>
      </main>
    </div>
  );
}
