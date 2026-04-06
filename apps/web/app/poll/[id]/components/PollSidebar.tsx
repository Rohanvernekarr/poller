"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  Settings2,
  Share2,
  CheckCircle2,
  Globe,
  Square,
  Play,
} from "lucide-react";
import { Button } from "@repo/ui/button";
import Link from "next/link";

interface PollSidebarProps {
  id: string;
  totalVotes: number;
  topOption?: { text: string };
  createdAtFormatted: string;
  creatorName: string;
  hideShareButton?: boolean;
  copied: boolean;
  onCopyLink: () => void;
  isOwner: boolean;
  isExpired: boolean;
  onOpenSettings: () => void;
  isDeleting: boolean;
  onDelete: () => void;
  isStoppingVoting?: boolean;
  onStopVoting: () => void;
  onReopenPoll: () => void;
}

export function PollSidebar({
  id,
  totalVotes,
  topOption,
  createdAtFormatted,
  creatorName,
  hideShareButton,
  copied,
  onCopyLink,
  isOwner,
  isExpired,
  onOpenSettings,
  isDeleting,
  onDelete,
  isStoppingVoting,
  onStopVoting,
  onReopenPoll,
}: PollSidebarProps) {
  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-24">
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BarChart3 className="w-4 h-4 text-foreground/40" />
            <h3 className="text-sm font-black uppercase tracking-widest italic">Stats</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.02] border border-border/50">
              <div className="flex items-center gap-2.5 text-foreground/40 italic">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">Votes</span>
              </div>
              <span className="text-lg font-black leading-none italic">
                {totalVotes.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.02] border border-border/50">
              <div className="flex items-center gap-2.5 text-foreground/40 italic">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">Top</span>
              </div>
              <span
                className="text-[11px] font-black uppercase tracking-tight truncate max-w-[100px] text-right italic"
                title={topOption?.text || "None"}
              >
                {topOption ? topOption.text : "None"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.02] border border-border/50">
              <div className="flex items-center gap-2.5 text-foreground/40 italic">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">Created</span>
              </div>
              <span className="text-[11px] font-black uppercase tracking-tight italic">{createdAtFormatted}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/[0.02] border border-border/50">
              <div className="flex items-center gap-2.5 text-foreground/40 italic">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">Author</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 truncate max-w-[100px] text-right italic">
                {creatorName}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {!hideShareButton && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="pt-2"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Share2 className="w-4 h-4 text-foreground/40" />
              <h3 className="text-sm font-black uppercase tracking-widest italic">Share</h3>
            </div>
            <div className="px-1">
              <div className="flex bg-foreground/[0.02] border border-border rounded-xl overflow-hidden group focus-within:ring-1 focus-within:ring-foreground/20 transition-shadow">
                <input
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="flex-1 bg-transparent border-none text-[11px] font-black uppercase tracking-tight text-foreground px-4 py-2.5 outline-none truncate italic opacity-40 group-focus-within:opacity-100"
                />
                <button
                  onClick={onCopyLink}
                  className={`px-4 flex items-center justify-center transition-colors font-black text-[10px] uppercase tracking-widest ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-foreground"
                  }`}
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isOwner && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="pt-5 border-t border-border space-y-3"
        >
          <p className="text-[9px] font-black uppercase tracking-widest text-foreground/25 px-1">Owner Controls</p>

          <Link href={`/poll/${id}/results`} className="block w-full">
            <Button className="w-full h-11 bg-foreground text-background hover:opacity-90 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-foreground/10 flex items-center justify-center gap-2 transition-all">
              <BarChart3 className="w-4 h-4" />
              View Full Results
            </Button>
          </Link>

          {/* Secondary row */}
          <div className="flex gap-2">
            <Button
              onClick={onOpenSettings}
              variant="outline"
              className="flex-1 h-9 border-border text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Settings
            </Button>

            {isExpired ? (
              <Button
                onClick={onReopenPoll}
                isLoading={isStoppingVoting}
                variant="outline"
                className="flex-1 h-9 border-border text-green-500/60 hover:text-green-500 hover:bg-green-500/5 hover:border-green-500/20 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                Reopen
              </Button>
            ) : (
              <Button
                onClick={onStopVoting}
                isLoading={isStoppingVoting}
                variant="outline"
                className="flex-1 h-9 border-border text-foreground/30 hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1.5 transition-all"
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </Button>
            )}
          </div>

          {/* Danger */}
          <Button
            onClick={onDelete}
            variant="ghost"
            className="w-full h-8 text-[9px] font-black uppercase tracking-widest text-foreground/20 hover:text-red-500 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2 rounded-xl"
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function SocialIcon({ icon, color }: { icon: any; color?: string }) {
  return (
    <button
      className={`w-full aspect-square rounded-xl bg-foreground/5 border border-border text-foreground hover:text-white flex items-center justify-center transition-all ${color}`}
    >
      {icon}
    </button>
  );
}
