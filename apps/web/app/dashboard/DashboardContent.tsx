"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { BarChart3, CheckCircle2, Plus, Search, LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { deletePoll } from "../utils/actions";
import { DeletePollModal } from "../components/DeletePollModal";
import { PollCard } from "./components/PollCard";
import { VotedPollCard } from "./components/VotedPollCard";

type SortOption = "newest" | "oldest" | "most_votes" | "least_votes";

export function DashboardContent({ polls, userVotes = [] }: { polls: any[], userVotes?: any[] }) {
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"created" | "voted">("created");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showSort, setShowSort] = useState(false);

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
      setDeletingPollId(null);
    } catch {
      setDeletingPollId(null);
      alert("Failed to delete poll");
    }
  };

  const sortLabel: Record<SortOption, string> = {
    newest: "Newest",
    oldest: "Oldest",
    most_votes: "Most Votes",
    least_votes: "Least Votes",
  };

  const filteredPolls = useMemo(() => {
    let list = polls.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    switch (sort) {
      case "newest": list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "oldest": list = [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "most_votes": list = [...list].sort((a, b) => b._count.votes - a._count.votes); break;
      case "least_votes": list = [...list].sort((a, b) => a._count.votes - b._count.votes); break;
    }
    return list;
  }, [polls, search, sort]);

  const filteredVotes = useMemo(() => {
    return userVotes.filter(v => v.poll.title.toLowerCase().includes(search.toLowerCase()));
  }, [userVotes, search]);

  const activeList = activeTab === "created" ? filteredPolls : filteredVotes;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black uppercase tracking-tight leading-none italic">Dashboard</h1>
          <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">
            {polls.length} {polls.length === 1 ? "poll" : "polls"} · {userVotes.length} voted
          </p>
        </div>
        <Link href="/create">
          <Button className="bg-foreground text-background font-black uppercase tracking-widest h-12 px-8 rounded-2xl flex items-center gap-2 shadow-2xl shadow-foreground/20 active:scale-95 group transition-all">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Create Poll
          </Button>
        </Link>
      </div>

      {/* Tabs + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-foreground/[0.04] rounded-2xl p-1 self-start">
          <button
            onClick={() => { setActiveTab("created"); setSearch(""); }}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "created" ? "bg-foreground text-background shadow" : "text-foreground/40 hover:text-foreground"}`}
          >
            My Polls
            <span className="ml-2 opacity-60">{polls.length}</span>
          </button>
          <button
            onClick={() => { setActiveTab("voted"); setSearch(""); }}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "voted" ? "bg-foreground text-background shadow" : "text-foreground/40 hover:text-foreground"}`}
          >
            Voted
            <span className="ml-2 opacity-60">{userVotes.length}</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search polls..."
              className="h-9 pl-9 pr-8 w-48 sm:w-56 rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] text-sm font-medium text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort (only for created) */}
          {activeTab === "created" && (
            <div className="relative">
              <button
                onClick={() => setShowSort(s => !s)}
                className={`h-9 px-3 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${showSort ? "bg-foreground text-background border-foreground" : "bg-foreground/[0.04] border-foreground/[0.08] text-foreground/50 hover:text-foreground"}`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {sortLabel[sort]}
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-44 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-50 py-1"
                  >
                    {(Object.keys(sortLabel) as SortOption[]).map(key => (
                      <button
                        key={key}
                        onClick={() => { setSort(key); setShowSort(false); }}
                        className={`w-full text-left px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors ${sort === key ? "text-foreground bg-foreground/5" : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.03]"}`}
                      >
                        {sortLabel[key]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-foreground/[0.04] rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${view === "grid" ? "bg-foreground text-background" : "text-foreground/30 hover:text-foreground"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${view === "list" ? "bg-foreground text-background" : "text-foreground/30 hover:text-foreground"}`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
          {activeList.length} result{activeList.length !== 1 ? "s" : ""} for &quot;{search}&quot;
        </p>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === "created" ? (
            filteredPolls.length === 0 ? (
              <EmptyState
                icon={<BarChart3 className="w-7 h-7 text-foreground/20" />}
                title={search ? "No polls match your search" : "No polls yet"}
                desc={search ? "Try a different keyword." : "Your first survey is just a click away."}
              />
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}>
                {filteredPolls.map((poll, i) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  >
                    <PollCard poll={poll} isDeleting={deletingPollId === poll.id} onDelete={() => handleDelete(poll.id)} view={view} />
                  </motion.div>
                ))}
              </div>
            )
          ) : (
            filteredVotes.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="w-7 h-7 text-foreground/20" />}
                title={search ? "No voted polls match your search" : "No votes yet"}
                desc={search ? "Try a different keyword." : "You haven't participated in any polls."}
              />
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-2"}>
                {filteredVotes.map((vote, i) => (
                  <motion.div
                    key={vote.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  >
                    <VotedPollCard vote={vote} poll={vote.poll} view={view} />
                  </motion.div>
                ))}
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      <DeletePollModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setPollToDelete(null); }}
        isDeleting={!!deletingPollId}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="py-24 text-center space-y-5 border border-dashed border-foreground/[0.07] rounded-3xl">
      <div className="mx-auto w-14 h-14 bg-foreground/[0.03] rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-black uppercase tracking-widest italic">{title}</h3>
        <p className="text-sm text-foreground/30 font-medium">{desc}</p>
      </div>
    </div>
  );
}
