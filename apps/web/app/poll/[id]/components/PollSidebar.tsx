"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  Settings2,
  Share2,
  CheckCircle2,
  Copy,
  MessageSquare,
  Mail,
  Globe,
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
  onOpenSettings: () => void;
  onDelete: () => void;
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
  onOpenSettings,
  onDelete,
}: PollSidebarProps) {
  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-24">
      {/* Analytics Card - Now part of the single card layout as a section */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <BarChart3 className="w-5 h-5 text-foreground" />
            <h3 className="text-xl font-bold">Analytics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-foreground/5 border border-border">
              <div className="flex items-center gap-3 text-foreground/70">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Total Votes</span>
              </div>
              <span className="text-xl font-black">
                {totalVotes.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-foreground/5 border border-border">
              <div className="flex items-center gap-3 text-foreground/70">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">Leading</span>
              </div>
              <span
                className="text-sm font-bold truncate max-w-[120px] text-right"
                title={topOption?.text || "None"}
              >
                {topOption ? topOption.text : "None"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-foreground/5 border border-border">
              <div className="flex items-center gap-3 text-foreground/70">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">Created</span>
              </div>
              <span className="text-sm font-bold">{createdAtFormatted}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-foreground/5 border border-border">
              <div className="flex items-center gap-3 text-foreground/70">
                <Settings2 className="w-4 h-4" />
                <span className="text-sm font-semibold">Creator</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/60">
                {creatorName}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Section */}
      {!hideShareButton && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="pt-4"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Share2 className="w-5 h-5 text-foreground" />
              <h3 className="text-lg font-bold">Share Poll</h3>
            </div>
            <div className="space-y-4 px-2">
              <div className="flex bg-foreground/5 border border-border rounded-xl overflow-hidden group focus-within:ring-2 focus-within:ring-foreground/50 transition-shadow">
                <input
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="flex-1 bg-transparent border-none text-sm font-medium text-foreground px-4 py-3 outline-none truncate"
                />
                <button
                  onClick={onCopyLink}
                  className={`p-2 flex items-center justify-center transition-colors font-bold text-sm ${
                    copied
                      ? "bg-gray-700 text-white"
                      : "bg-foreground/10 hover:bg-foreground/20 text-foreground"
                  }`}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
          className="pt-6 border-t border-border mt-2"
        >
          <Link href={`/poll/${id}/results`} className="block w-full">
            <Button
              variant="outline"
              className="w-full h-12 text-sm font-semibold border-foreground/20 hover:border-foreground bg-foreground hover:bg-foreground text-background transition-all flex items-center justify-center gap-2 rounded-xl mb-3"
            >
              <BarChart3 className="w-4 h-4" />
              Advanced Analytics
            </Button>
          </Link>
          
          <Button
            onClick={onOpenSettings}
            variant="outline"
            className="w-full h-12 text-sm font-semibold border-foreground/20 hover:border-foreground bg-foreground/5 hover:bg-foreground/10 transition-all flex items-center justify-center gap-2 rounded-xl mb-3"
          >
            <Settings2 className="w-4 h-4 text-foreground" />
            Poll Settings
          </Button>
          <Button
            onClick={onDelete}
            variant="ghost"
            className="w-full h-12 text-sm font-semibold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2 rounded-xl"
          >
            Delete Poll
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
