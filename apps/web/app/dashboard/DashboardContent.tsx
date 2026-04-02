"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@repo/ui/button";
import { BarChart3, Users, Clock, Trash2, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { deletePoll } from "../actions";
import { DeletePollModal } from "../components/DeletePollModal";

export function DashboardContent({ polls }: { polls: any[] }) {
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);

  const handleDelete = (pollId: string) => {
    setPollToDelete(pollId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pollToDelete) return;
    setDeletingPollId(pollToDelete);
    try {
      await deletePoll(pollToDelete);
      setIsDeleteModalOpen(false);
      setPollToDelete(null);
    } catch (e) {
      setDeletingPollId(null);
      alert("Failed to delete poll");
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <motion.div 
               key={poll.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
            >
               <PollCard poll={poll} isDeleting={deletingPollId === poll.id} onDelete={() => handleDelete(poll.id)} />
            </motion.div>
          ))}
        </div>
      )}
      <DeletePollModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPollToDelete(null);
        }} 
        isDeleting={!!deletingPollId}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function PollCard({ poll, isDeleting, onDelete }: { poll: any; isDeleting: boolean; onDelete: () => void }) {
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
            <div className="flex items-center gap-4 text-[9px] font-black text-foreground/25 uppercase tracking-widest">
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
            className="p-3 h-9 w-9 text-foreground/15 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex-shrink-0"
            title="Delete Poll"
          >
            {!isDeleting && <Trash2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Mini Bar Chart */}
        <div className="space-y-4 relative">
          {poll.options.slice(0, 4).map((option: any) => { 
            const percentage = totalVotes === 0 ? 0 : (option._count.votes / totalVotes) * 100;
            return (
              <div key={option.id} className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
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
            <div className="text-[8px] font-black uppercase tracking-widest text-foreground/20 text-center italic">
              + {poll.options.length - 4} more options
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 flex items-center gap-3 relative">
        <Link href={`/poll/${poll.id}`} className="flex-1">
          <Button variant="outline" className="w-full h-10 border-border text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all">
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

