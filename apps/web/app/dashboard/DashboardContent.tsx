"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui/button";
import { BarChart3, Users, Clock, Trash2, ArrowRight, Plus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { deletePoll } from "../actions";
import { DeletePollModal } from "../components/DeletePollModal";
import { PollCard } from "./components/PollCard";
import { VotedPollCard } from "./components/VotedPollCard";

export function DashboardContent({ polls, userVotes = [] }: { polls: any[], userVotes?: any[] }) {
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"created" | "voted">("created");

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
          <h1 className="text-5xl font-black uppercase tracking-tight leading-none italic">Dashboard</h1>
          <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">Manage your active polls and track real-time results.</p>
        </div>
        <Link href="/create">
          <Button className="bg-foreground text-background font-black uppercase tracking-widest h-12 px-8 rounded-2xl flex items-center gap-2 shadow-2xl shadow-foreground/20 transition-all active:scale-95 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Create Poll
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <button 
          onClick={() => setActiveTab("created")}
          className={`text-sm font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${activeTab === "created" ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}
        >
          My Polls
        </button>
        <button 
          onClick={() => setActiveTab("voted")}
          className={`text-sm font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${activeTab === "voted" ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"}`}
        >
          Voted Polls
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "created" ? (
            polls.length === 0 ? (
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
                  <PollCard key={poll.id} poll={poll} isDeleting={deletingPollId === poll.id} onDelete={() => handleDelete(poll.id)} />
                ))}
              </div>
            )
          ) : (
            userVotes.length === 0 ? (
              <div className="py-32 text-center space-y-6 bg-zinc-900/20 border border-zinc-900 rounded-3xl border-dashed">
                <div className="mx-auto w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-zinc-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">No votes yet</h3>
                  <p className="text-zinc-500">You haven't participated in any polls.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userVotes.map((vote) => (
                  <VotedPollCard key={vote.id} vote={vote} poll={vote.poll} />
                ))}
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

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

