"use client";

import { Button } from "@repo/ui/button";
import { Users, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function VotedPollCard({ vote, poll }: { vote: any; poll: any }) {
  const totalVotes = poll._count.votes;
  
  return (
    <div className="group relative bg-background/50 border border-border rounded-3xl p-6 space-y-6 hover:bg-foreground/[0.02] transition-all duration-500 overflow-hidden h-full flex flex-col justify-between backdrop-blur-sm">
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-foreground/[0.02] blur-[120px] group-hover:bg-foreground/[0.04] transition-colors" />

      <div className="space-y-6 relative">
        <div className="flex items-start justify-between gap-4 relative">
          <div className="space-y-2 min-w-0 flex-1">
            <h2 className="text-lg font-black uppercase tracking-tight group-hover:text-foreground transition-colors leading-tight italic truncate" title={poll.title}>
              {poll.title}
            </h2>
            <div className="flex items-center gap-4 text-[9px] font-black text-foreground/90 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                {totalVotes} Total {totalVotes === 1 ? 'Vote' : 'Votes'}
              </span>
              <span className="flex items-center gap-1.5 text-green-500">
                <CheckCircle2 className="w-3 h-3" />
                Voted
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-foreground/5 rounded-2xl border border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">You Voted For:</p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm font-bold text-foreground leading-tight">{vote.option.text}</p>
          </div>
        </div>
      </div>

      <div className="pt-6 flex items-center gap-3 relative">
        <Link href={`/poll/${poll.id}`} className="flex-1">
          <Button variant="outline" className="w-full h-10 border-border text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all">
            View Poll
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
        <Link href={`/poll/${poll.id}/results`} className="flex-1">
          <Button className="w-full h-10 bg-foreground text-background hover:opacity-90 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-foreground/10">
            Results
          </Button>
        </Link>
      </div>
    </div>
  );
}
