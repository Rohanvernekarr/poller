"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import { BarChart3, Users, Clock, Trash2, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { deletePoll } from "../actions";

export function DashboardContent({ polls }: { polls: any[] }) {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-black uppercase tracking-tight leading-none italic">Dashboard</h1>
          <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">Manage your active polls and track real-time results.</p>
        </div>
        <Link href="/create">
          <Button className="bg-foreground text-background font-black uppercase tracking-widest h-12 px-8 rounded-2xl flex items-center gap-2 shadow-2xl shadow-foreground/20 transition-all active:scale-95 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Create Poll
          </Button>
        </Link>
      </div>

      {polls.length === 0 ? (
        <div className="py-32 text-center space-y-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl border-dashed">
          <div className="mx-auto w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-zinc-700" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">No polls yet</h3>
            <p className="text-zinc-500">Your first survey is just a click away.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {polls.map((poll) => (
            <motion.div 
               key={poll.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
            >
               <PollCard poll={poll} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function PollCard({ poll }: { poll: any }) {
  const totalVotes = poll._count.votes;

  return (
    <div className="group relative bg-background/50 border border-border rounded-[2.5rem] p-10 space-y-10 hover:bg-foreground/[0.03] transition-all duration-500 overflow-hidden h-full flex flex-col justify-between backdrop-blur-sm">
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-foreground/[0.03] blur-[120px] group-hover:bg-foreground/[0.06] transition-colors" />

      <div className="space-y-10 relative">
        <div className="flex items-start justify-between gap-6 relative">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tight group-hover:text-foreground transition-colors leading-none italic">{poll.title}</h2>
            <div className="flex items-center gap-6 text-[10px] font-black text-foreground/30 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                {totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                {new Date(poll.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <form action={async (formData) => {
             if (window.confirm("Are you sure you want to delete this poll?")) {
               await deletePoll(poll.id);
             }
          }}>
             <button 
               type="submit"
               className="p-4 text-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
               title="Delete Poll"
             >
               <Trash2 className="w-5 h-5" />
             </button>
          </form>
        </div>

        {/* Mini Bar Chart */}
        <div className="space-y-6 relative">
          {poll.options.map((option: any) => {
            const percentage = totalVotes === 0 ? 0 : (option._count.votes / totalVotes) * 100;
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
                  <span className="truncate max-w-[80%]">{option.text}</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
                <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-foreground transition-all duration-1000 ease-out"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-10 flex items-center gap-4 relative">
        <Link href={`/poll/${poll.id}`} className="flex-1">
          <Button variant="outline" className="w-full h-12 border-border text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all">
            Open Poll
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href={`/poll/${poll.id}/results`} className="flex-1">
          <Button className="w-full h-12 bg-foreground text-background hover:opacity-90 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-foreground/20">
            Analytics
          </Button>
        </Link>
      </div>
    </div>
  );
}
