"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import { Users, Clock, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PollCard({ poll, isDeleting, onDelete }: { poll: any; isDeleting: boolean; onDelete: () => void }) {
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
                {totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {new Date(poll.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onDelete}
            isLoading={isDeleting}
            className="p-3 h-9 w-9 text-red-300 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex-shrink-0"
            title="Delete Poll"
          >
            {!isDeleting && <Trash2 className="w-4 h-4" />}
          </Button>
        </div>

        <div className="space-y-4 relative">
          {poll.options.slice(0, 4).map((option: any) => { 
            const percentage = totalVotes === 0 ? 0 : (option._count.votes / totalVotes) * 100;
            return (
              <div key={option.id} className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/60">
                  <span className="truncate max-w-[80%]">{option.text}</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
                <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-foreground transition-all duration-1000 ease-out"
                  />
                </div>
              </div>
            );
          })}
          {poll.options.length > 4 && (
            <div className="text-[8px] font-black uppercase tracking-widest text-foreground/30 text-center italic">
              + {poll.options.length - 4} more options
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 flex items-center gap-3 relative">
        <Link href={`/poll/${poll.id}`} className="flex-1">
          <Button variant="outline" className="w-full h-10 border-border text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all">
            View
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
        <Link href={`/poll/${poll.id}/results`} className="flex-1">
          <Button className="w-full h-10 bg-foreground text-background hover:opacity-90 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-foreground/10">
            Result
          </Button>
        </Link>
      </div>
    </div>
  );
}
