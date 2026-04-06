"use client";

import { Button } from "@repo/ui/button";
import { Users, CheckCircle2, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export function VotedPollCard({ vote, poll, view }: { vote: any; poll: any; view: "grid" | "list" }) {
  const totalVotes = poll._count.votes;

  if (view === "list") {
    return (
      <div className="group flex items-center gap-4 px-5 py-4 bg-background border border-border rounded-2xl hover:bg-foreground/[0.02] transition-all duration-200">
        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black uppercase tracking-tight italic truncate" title={poll.title}>{poll.title}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mt-0.5">Voted: {vote.option.text}</p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-foreground/30 flex-shrink-0">
          <span className="flex items-center gap-1.5"><Users className="w-3 h-3" />{totalVotes} votes</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{new Date(vote.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={`/poll/${poll.id}`}>
            <Button variant="ghost" size="sm" className="h-8 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-border hover:bg-foreground/5">
              View
            </Button>
          </Link>
          <Link href={`/poll/${poll.id}/results`}>
            <Button size="sm" className="h-8 px-3 rounded-xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:opacity-90">
              Results
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-background/50 border border-border rounded-3xl p-6 space-y-5 hover:bg-foreground/[0.02] transition-all duration-300 flex flex-col justify-between backdrop-blur-sm">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-base font-black uppercase tracking-tight italic truncate" title={poll.title}>{poll.title}</h2>
          <div className="flex items-center gap-3 text-[9px] font-black text-foreground/40 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{totalVotes} votes</span>
            <span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="w-2.5 h-2.5" />Voted</span>
          </div>
        </div>
        <div className="p-3.5 bg-foreground/[0.03] rounded-2xl border border-foreground/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30">Your Vote</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 flex items-center gap-1 italic">
              <Clock className="w-2.5 h-2.5" />
              {new Date(vote.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            </div>
            <p className="text-sm font-bold text-foreground leading-tight truncate">{vote.option.text}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href={`/poll/${poll.id}`} className="flex-1">
          <Button variant="outline" className="w-full h-9 rounded-xl border-border text-foreground/50 hover:text-foreground text-[10px] font-black uppercase tracking-widest gap-1.5">
            View <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
        <Link href={`/poll/${poll.id}/results`} className="flex-1">
          <Button className="w-full h-9 rounded-xl bg-foreground text-background hover:opacity-90 text-[10px] font-black uppercase tracking-widest">
            Results
          </Button>
        </Link>
      </div>
    </div>
  );
}
