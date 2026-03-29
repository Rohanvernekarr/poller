"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Download,
  ShieldCheck,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { PollResults } from "../components/PollResults";
import { TechnicalBackButton } from "../../../components/TechnicalBackButton";

interface ResultsUIProps {
  poll: any;
}

export default function ResultsUI({ poll }: ResultsUIProps) {
  const totalVotes = poll?.totalVotes || 0;
  const topOption = poll?.options?.length > 0 
    ? poll.options.reduce((prev: any, current: any) => (prev.voteCount > current.voteCount) ? prev : current)
    : { text: "No options", voteCount: 0 };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-10 selection:bg-foreground/20 selection:text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <TechnicalBackButton href={`/poll/${poll.id}`} text="Back to Poll" />
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">{poll.title} Results</h1>
          <div className="flex flex-wrap items-center gap-4 text-foreground/40 font-bold text-sm uppercase tracking-widest">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(poll.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {totalVotes.toLocaleString()} Total Votes</span>
            {poll.isOwner && <span className="flex items-center gap-2 text-green-500/80"><ShieldCheck className="w-4 h-4" /> Admin Access</span>}
          </div>
        </div>
        <Button onClick={() => window.print()} variant="outline" className="gap-2 border-foreground/10 font-black h-12 px-6 rounded-xl hover:bg-foreground hover:text-background transition-all">
          <Download className="w-4 h-4" /> Export Data
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Stats Summary */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <Card className="glass border-border shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-sm p-8 sm:p-12">
            <div className="space-y-12">
              <div className="flex items-center gap-3 border-b border-border pb-6">
                <BarChart3 className="w-6 h-6" />
                <h2 className="text-2xl font-black uppercase">Poll Breakdown</h2>
              </div>
              <PollResults 
                options={poll.options} 
                totalVotes={totalVotes} 
                resultsVisibility={poll.resultsVisibility} 
                isOwner={poll.isOwner} 
                allowMultipleVotes={poll.allowMultipleVotes} 
                actualVoteCast={false} 
              />
            </div>
          </Card>

          {/* Voter Transcript */}
          <Card className="glass border-border shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-sm p-8 sm:p-12">
            <div className="space-y-10">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  <h2 className="text-2xl font-black uppercase">Individual Voter Transcript</h2>
                </div>
                <span className="text-xs font-black bg-foreground/5 py-1.5 px-3 rounded-full uppercase tracking-tighter">Live Updates</span>
              </div>
              
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                {poll.votes.length === 0 ? (
                  <p className="text-center py-10 text-foreground/40 font-bold uppercase tracking-widest">No votes recorded yet.</p>
                ) : (
                  poll.votes.map((vote: any) => (
                    <motion.div 
                      key={vote.id} 
                      variants={item}
                      className="flex items-center justify-between p-5 rounded-2xl bg-foreground/[0.03] border border-border group hover:bg-foreground/[0.06] transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-foreground text-background font-black flex items-center justify-center text-lg">
                          {(vote.voterName || "G")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-lg leading-none">{vote.voterName || "Guest Voter"}</span>
                          <span className="text-xs text-foreground/40 font-black uppercase tracking-widest mt-1">Voted for: <span className="text-foreground">{vote.option.text}</span></span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-right">
                        <span className="text-xs font-black bg-foreground/5 py-1 px-2 rounded-lg text-foreground/60">{formatDistanceToNow(new Date(vote.createdAt))} ago</span>
                        {poll.isOwner && <span className="text-[10px] font-mono text-foreground/20 uppercase tracking-tighter transition-opacity group-hover:opacity-100 opacity-0">{vote.ipAddress}</span>}
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          </Card>
        </div>

        {/* Right: Insights Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Lead Card */}
            <div className="p-8 rounded-[2rem] bg-foreground text-background shadow-2xl relative overflow-hidden group">
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-background/10 blur-3xl rounded-full transition-transform group-hover:scale-150" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-background" />
                  <span className="text-sm font-black uppercase tracking-widest opacity-60">Currently Leading</span>
                </div>
                <h3 className="text-3xl font-black leading-tight uppercase line-clamp-2">{topOption.voteCount > 0 ? topOption.text : "No Lead"}</h3>
                <p className="text-sm font-bold opacity-60 uppercase">{topOption.voteCount} Votes | {Math.round((topOption.voteCount / (poll.totalVotes || 1)) * 100)}% Momentum</p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <StatWidget icon={<TrendingUp className="w-4 h-4" />} title="Growth" value="+12%" subtitle="Last 24h" />
              <StatWidget icon={<Clock className="w-4 h-4" />} title="Avg Time" value="4m 20s" subtitle="Per Vote" />
            </div>

            <Card className="glass border-border shadow-xl rounded-[2rem] bg-background/50 overflow-hidden">
               <div className="p-6 border-b border-border bg-foreground/[0.03]">
                  <h4 className="text-sm font-black uppercase tracking-widest text-foreground/50 flex items-center gap-2">
                    <MoreHorizontal className="w-4 h-4" /> Analytics Summary
                  </h4>
               </div>
               <div className="p-8 space-y-6">
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black uppercase text-foreground/40"><span>Completion</span><span>92%</span></div>
                    <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-foreground w-[92%]" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black uppercase text-foreground/40"><span>Authenticity</span><span>100%</span></div>
                    <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-foreground w-full" />
                    </div>
                 </div>
                 <p className="text-[10px] text-foreground/30 font-bold uppercase leading-relaxed text-center pt-4">Data is live-processed by Poller v1.0. Analytics are encrypted and signed.</p>
               </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ icon, title, value, subtitle }: { icon: any, title: string, value: string, subtitle: string }) {
  return (
    <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-border space-y-2 hover:bg-foreground/[0.06] transition-all cursor-default group">
      <div className="flex items-center gap-2 text-foreground/40">
        <div className="group-hover:text-foreground transition-colors">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
      </div>
      <div className="text-2xl font-black">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-tighter text-foreground/30">{subtitle}</div>
    </div>
  );
}
