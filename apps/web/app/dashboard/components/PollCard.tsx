"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import { Users, Clock, Trash2, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";

export function PollCard({ poll, isDeleting, onDelete, view }: { poll: any; isDeleting: boolean; onDelete: () => void; view: "grid" | "list" }) {
  const totalVotes = poll._count.votes;
  const isExpired = poll.expiresAt && new Date() > new Date(poll.expiresAt);

  if (view === "list") {
    return (
      <div className="group flex items-center gap-4 px-5 py-4 bg-background border border-border rounded-2xl hover:bg-foreground/[0.02] transition-all duration-200">
        {/* Status dot */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isExpired ? "bg-foreground/20" : "bg-green-500"}`} />

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black uppercase tracking-tight leading-tight truncate italic" title={poll.title}>{poll.title}</p>
        </div>

        {/* Meta */}
        <div className="hidden sm:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-foreground/40 flex-shrink-0">
          <span className="flex items-center gap-1.5"><Users className="w-3 h-3" />{totalVotes}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{new Date(poll.createdAt).toLocaleDateString()}</span>
          {isExpired && <span className="text-foreground/20">Ended</span>}
        </div>

        {/* Actions */}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            isLoading={isDeleting}
            className="h-8 w-8 p-0 rounded-xl text-foreground/20 hover:text-red-500 hover:bg-red-500/10 transition-all flex-shrink-0"
          >
            {!isDeleting && <Trash2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-background/50 border border-border rounded-3xl p-6 space-y-6 hover:bg-foreground/[0.02] transition-all duration-300 flex flex-col justify-between backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isExpired ? "bg-foreground/20" : "bg-green-500"}`} />
              <h2 className="text-base font-black uppercase tracking-tight italic truncate leading-tight" title={poll.title}>{poll.title}</h2>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-black text-foreground/40 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Users className="w-2.5 h-2.5" />{totalVotes} votes</span>
              <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{new Date(poll.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            isLoading={isDeleting}
            className="p-2 h-8 w-8 text-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl flex-shrink-0"
          >
            {!isDeleting && <Trash2 className="w-3.5 h-3.5" />}
          </Button>
        </div>

        <div className="space-y-2">
          {poll.options.slice(0, 3).map((option: any) => {
            const pct = totalVotes === 0 ? 0 : (option._count.votes / totalVotes) * 100;
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
                  <span className="truncate max-w-[80%]">{option.text}</span>
                  <span>{Math.round(pct)}%</span>
                </div>
                <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full bg-foreground rounded-full" />
                </div>
              </div>
            );
          })}
          {poll.options.length > 3 && (
            <p className="text-[8px] font-black uppercase tracking-widest text-foreground/25 italic">+{poll.options.length - 3} more</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
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
