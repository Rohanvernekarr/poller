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
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter">Dashboard</h1>
          <p className="text-zinc-500 font-medium">Manage your active polls and track real-time results.</p>
        </div>
        <Link href="/create">
          <Button className="bg-foreground text-background font-semibold h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            Create New Poll
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
    <div className="group relative bg-zinc-900/30 border border-zinc-900 rounded-[32px] p-8 space-y-8 hover:bg-zinc-900/50 hover:border-zinc-800 transition-all duration-500 overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[100px] group-hover:bg-white/10 transition-colors" />

      <div className="space-y-8 relative">
        <div className="flex items-start justify-between gap-4 relative">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight group-hover:text-white transition-colors">{poll.title}</h2>
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
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
          
          <form action={async (formData) => {
             if (window.confirm("Are you sure you want to delete this poll?")) {
               await deletePoll(poll.id);
             }
          }}>
             <button 
               type="submit"
               className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
               title="Delete Poll"
             >
               <Trash2 className="w-5 h-5" />
             </button>
          </form>
        </div>

        {/* Mini Bar Chart */}
        <div className="space-y-4 relative">
          {poll.options.map((option: any) => {
            const percentage = totalVotes === 0 ? 0 : (option._count.votes / totalVotes) * 100;
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span className="truncate max-w-[80%]">{option.text}</span>
                  <span>{Math.round(percentage)}%</span>
                </div>
                <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className="h-full bg-white transition-all duration-1000 ease-out"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-8 flex items-center gap-3 relative">
        <Link href={`/poll/${poll.id}`} className="flex-1">
          <Button variant="outline" className="w-full h-10 border-border text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all">
            View Poll
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href={`/poll/${poll.id}/results`} className="flex-1">
          <Button className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 rounded-lg font-semibold text-sm transition-all shadow-md">
            Full Results
          </Button>
        </Link>
      </div>
    </div>
  );
}
