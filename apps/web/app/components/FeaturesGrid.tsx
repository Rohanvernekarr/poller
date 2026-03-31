"use client";

import { BarChart3, Users } from "lucide-react";

export function FeaturesGrid() {
  return (
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
  );
}
