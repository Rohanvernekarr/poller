"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, ChevronDown, ChevronUp, X, ArrowUp01, ArrowDown01 } from "lucide-react";

export function CommentsSection({ pollId }: { pollId: string }) {
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const { data, mutate } = useSWR(
    `/api/comments?pollId=${pollId}`,
    (url: string) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 }
  );

  // Body Scroll Lock for Viewer
  useEffect(() => {
    if (isViewerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isViewerOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pollId, text, authorName }),
      });
      setText("");
      mutate();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const comments = useMemo(() => {
    const base = data?.comments || [];
    return [...base].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });
  }, [data?.comments, sortOrder]);

  const isHighVolume = comments.length > 10;
  const visibleComments = isHighVolume && !isViewerOpen ? comments.slice(0, 3) : comments;

  return (
    <div className="mt-16 border-t border-border pt-12 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center border border-border">
            <MessageSquare className="w-5 h-5 text-foreground" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Discussion</h3>
          <span className="text-xs font-black bg-foreground/5 py-1 px-3 rounded-full text-foreground/40 uppercase tracking-tighter">
            {comments.length}
          </span>
        </div>
        
        {isHighVolume && !isViewerOpen && (
          <button 
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground flex items-center gap-2 transition-colors"
          >
            {sortOrder === "newest" ? <ArrowDown01 className="w-3.5 h-3.5" /> : <ArrowUp01 className="w-3.5 h-3.5" />}
            {sortOrder}
          </button>
        )}
      </div>
      
      {/* Input Form (Always Visible) */}
      <form onSubmit={handleSubmit} className="mb-12 space-y-4 group">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input
            placeholder="Your name (optional)"
            value={authorName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthorName(e.target.value)}
            className="sm:col-span-1 h-12 rounded-xl bg-foreground/[0.03] border-border focus:ring-foreground/20 font-bold text-sm"
          />
          <div className="sm:col-span-3 flex gap-3">
            <Input
              placeholder="Add your voice to the conversation..."
              value={text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
              required
              className="flex-1 h-12 rounded-xl bg-foreground/[0.03] border-border focus:ring-foreground/20 font-bold text-sm"
            />
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              className="h-12 px-6 rounded-xl bg-foreground text-background font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center gap-2 font-bold"
            >
              Post <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </form>

      {/* Main List / Summary */}
      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {visibleComments.length > 0 ? (
            visibleComments.map((comment: any, idx: number) => (
              <CommentCard key={comment.id} comment={comment} delay={idx * 0.05} />
            ))
          ) : (
             <div className="text-center py-20 bg-foreground/[0.02] rounded-[2rem] border border-dashed border-border group">
                <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-foreground/30 font-black uppercase tracking-widest text-xs">No discussions yet</p>
                <p className="text-[10px] text-foreground/20 font-bold uppercase mt-1">Be the first to speak your mind</p>
             </div>
          )}
        </AnimatePresence>

        {isHighVolume && !isViewerOpen && (
          <div className="pt-4 flex justify-center">
            <button 
              type="button"
              onClick={() => setIsViewerOpen(true)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="px-8 py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs shadow-2xl shadow-foreground/20 group-hover:scale-105 active:scale-95 transition-all">
                Launch Discussion Viewer ({comments.length})
              </div>
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-tighter italic">Manage high-volume thread</span>
            </button>
          </div>
        )}
      </div>

      {/* Full Discussion Viewer Overlay */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl h-full max-h-[90vh] bg-background border border-border shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-foreground/[0.02]">
                <div className="space-y-1">
                  <h4 className="text-2xl font-black uppercase tracking-tight">Full Discussion Thread</h4>
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">{comments.length} total messages in this poll</p>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
                    className="h-12 px-4 rounded-xl border border-border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-foreground/5 transition-colors"
                  >
                    {sortOrder === "newest" ? <ArrowDown01 className="w-4 h-4" /> : <ArrowUp01 className="w-4 h-4" />}
                    Sort by {sortOrder}
                  </button>
                  <button 
                    onClick={() => setIsViewerOpen(false)}
                    className="w-12 h-12 rounded-xl bg-foreground/5 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all group"
                  >
                    <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 custom-scrollbar">
                {comments.map((comment: any, idx: number) => (
                  <CommentCard key={comment.id} comment={comment} delay={idx * 0.03} />
                ))}
              </div>

              <div className="p-8 bg-foreground/[0.02] border-t border-border text-center">
                 <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">End of thread • Poller High-Volume Engine v1.0</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CommentCard({ comment, delay }: { comment: any, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex gap-4 group"
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center font-black text-sm uppercase">
          {(comment.authorName || "A")[0]}
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="font-black text-sm uppercase tracking-tight text-foreground line-clamp-1">
            {comment.authorName || "Anonymous Voter"}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 italic whitespace-nowrap">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <div className="p-5 rounded-[1.5rem] bg-foreground/[0.03] border border-border group-hover:bg-foreground/[0.05] transition-all">
          <p className="text-foreground/80 text-sm font-medium leading-relaxed break-words">{comment.text}</p>
        </div>
      </div>
    </motion.div>
  );
}


