"use client";

import { motion } from "framer-motion";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { 
  BarChart3, Users, Calendar, TrendingUp, Trophy, Clock, Download,
  ShieldCheck, MoreHorizontal, Fingerprint, Globe
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PollResults } from "../components/PollResults";
import { TechnicalBackButton } from "../../../components/TechnicalBackButton";

interface ResultsUIProps { poll: any; }

export default function ResultsUI({ poll }: ResultsUIProps) {
  const totalVotes: number = poll?.totalVotes || 0;
  const votes: any[] = poll?.votes || [];

  const topOption = poll?.options?.length > 0
    ? poll.options.reduce((prev: any, curr: any) => prev.voteCount > curr.voteCount ? prev : curr)
    : { text: "No options", voteCount: 0 };

  // ── Real Analytics ────────────────────────────────────
  const now = Date.now();
  const msIn24h = 24 * 60 * 60 * 1000;
  const votesLast24h = votes.filter(v => now - new Date(v.createdAt).getTime() < msIn24h).length;
  const votesPrev24h = votes.filter(v => {
    const age = now - new Date(v.createdAt).getTime();
    return age >= msIn24h && age < msIn24h * 2;
  }).length;

  const growthPct = votesPrev24h === 0
    ? (votesLast24h > 0 ? 100 : 0)
    : Math.round(((votesLast24h - votesPrev24h) / votesPrev24h) * 100);

  // Unique IPs / fingerprints → authenticity
  const uniqueFingerprints = new Set(votes.map(v => v.fingerprintHash).filter(Boolean)).size;
  const authenticityPct = totalVotes === 0 ? 100 : Math.round((uniqueFingerprints / totalVotes) * 100);

  // Named vs guest
  const namedVoters = votes.filter(v => v.voterName && v.voterName !== "Guest Voter").length;
  const completionPct = totalVotes === 0 ? 0 : Math.round((namedVoters / totalVotes) * 100);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { y: 12, opacity: 0 }, show: { y: 0, opacity: 1 } };

  return (
    <div className="space-y-10 selection:bg-foreground/20 selection:text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <TechnicalBackButton href={`/poll/${poll.id}`} text="Back to Poll" />
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none uppercase">{poll.title} Results</h1>
          <div className="flex flex-wrap items-center gap-4 text-foreground/40 font-bold text-sm uppercase tracking-widest">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(poll.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" />{totalVotes.toLocaleString()} Total Votes</span>
            {poll.isOwner && <span className="flex items-center gap-2 text-green-500/80"><ShieldCheck className="w-4 h-4" />Admin Access</span>}
          </div>
        </div>
        <Button onClick={() => window.print()} variant="outline" className="gap-2 border-foreground/10 font-black h-12 px-6 rounded-xl hover:bg-foreground hover:text-background transition-all">
          <Download className="w-4 h-4" /> Export Data
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Poll Breakdown */}
          <Card className="glass border-border shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-sm p-8 sm:p-12">
            <div className="space-y-10">
              <div className="flex items-center gap-3 border-b border-border pb-6">
                <BarChart3 className="w-6 h-6" />
                <h2 className="text-2xl font-black uppercase">Poll Breakdown</h2>
              </div>
              <PollResults options={poll.options} totalVotes={totalVotes} resultsVisibility={poll.resultsVisibility} isOwner={poll.isOwner} allowMultipleVotes={poll.allowMultipleVotes} actualVoteCast={false} />
            </div>
          </Card>

          {/* Voter Transcript */}
          <Card className="glass border-border shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-sm p-8 sm:p-12">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6" />
                  <h2 className="text-2xl font-black uppercase">Voter Transcript</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Live</span>
                </div>
              </div>

              {/* Column headers */}
              {votes.length > 0 && (
                <div className={`grid text-[9px] font-black uppercase tracking-widest text-foreground/25 px-3 pb-2 border-b border-border ${poll.isOwner ? "grid-cols-[2rem_1fr_1fr_auto_auto_auto]" : "grid-cols-[2rem_1fr_1fr_auto]"} gap-4`}>
                  <span>#</span>
                  <span>Voter</span>
                  <span>Choice</span>
                  <span>Time</span>
                  {poll.isOwner && <span>IP</span>}
                  {poll.isOwner && <span>Device</span>}
                </div>
              )}

              {/* Scrollable list */}
              <div className="max-h-[480px] overflow-y-auto -mx-1 px-1 space-y-0.5">
                {votes.length === 0 ? (
                  <p className="text-center py-10 text-foreground/30 font-black uppercase tracking-widest text-[10px]">No votes recorded yet.</p>
                ) : (
                  votes.map((vote: any, i: number) => {
                    const isAnonymized = vote.ipAddress === "Redacted";
                    const initials = (vote.voterName || "G").slice(0, 2).toUpperCase();
                    const shortFp = vote.fingerprintHash && vote.fingerprintHash !== "Redacted"
                      ? vote.fingerprintHash.slice(0, 8)
                      : null;
                    const ip = vote.ipAddress && !isAnonymized ? vote.ipAddress : null;

                    return (
                      <div
                        key={vote.id}
                        className={`grid items-center gap-4 px-3 py-2 rounded-xl hover:bg-foreground/[0.04] transition-colors group ${poll.isOwner ? "grid-cols-[2rem_1fr_1fr_auto_auto_auto]" : "grid-cols-[2rem_1fr_1fr_auto]"}`}
                      >
                        {/* # */}
                        <span className="text-[9px] font-black text-foreground/20 tabular-nums">{i + 1}</span>

                        {/* Name */}
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-foreground/10 text-foreground font-black flex items-center justify-center text-[9px] flex-shrink-0 select-none">
                            {initials}
                          </div>
                          <span className="text-[11px] font-black text-foreground/80 truncate">{vote.voterName || "Anonymous"}</span>
                        </div>

                        {/* Choice */}
                        <span className="text-[11px] font-bold text-foreground/50 truncate">"{vote.option.text}"</span>

                        {/* Time */}
                        <span className="text-[10px] font-black text-foreground/25 whitespace-nowrap tabular-nums">
                          {formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}
                        </span>

                        {/* IP (owner only) */}
                        {poll.isOwner && (
                          <span className="text-[9px] font-mono text-foreground/25 whitespace-nowrap">
                            {ip ?? <span className="text-foreground/15">—</span>}
                          </span>
                        )}

                        {/* Fingerprint (owner only) */}
                        {poll.isOwner && (
                          <span className="text-[9px] font-mono text-foreground/20 whitespace-nowrap">
                            {shortFp ? `${shortFp}…` : <span className="text-foreground/10">—</span>}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {votes.length > 0 && (
                <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20 text-right pt-2">
                  {votes.length} {votes.length === 1 ? "vote" : "votes"} total
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4">

            <div className="p-7 rounded-[2rem] bg-foreground text-background shadow-2xl relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-background/10 blur-3xl rounded-full" />
              <div className="relative space-y-3">
                <div className="flex items-center gap-2 opacity-60">
                  <Trophy className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Currently Leading</span>
                </div>
                <h3 className="text-2xl font-black leading-tight uppercase line-clamp-2">
                  {topOption.voteCount > 0 ? topOption.text : "No Lead Yet"}
                </h3>
                <p className="text-xs font-bold opacity-50 uppercase">
                  {topOption.voteCount} votes · {totalVotes > 0 ? Math.round((topOption.voteCount / totalVotes) * 100) : 0}% share
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatWidget
                icon={<TrendingUp className="w-4 h-4" />}
                title="Growth"
                value={growthPct > 0 ? `+${growthPct}%` : growthPct < 0 ? `${growthPct}%` : "—"}
                subtitle="vs prev 24h"
                highlight={growthPct > 0}
              />
              <StatWidget
                icon={<Clock className="w-4 h-4" />}
                title="Last 24h"
                value={String(votesLast24h)}
                subtitle="new votes"
              />
            </div>

            <div className="rounded-[2rem] border border-border bg-background/50 overflow-hidden">
              <div className="p-5 border-b border-border">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                  <MoreHorizontal className="w-4 h-4" />Analytics Summary
                </h4>
              </div>
              <div className="p-6 space-y-5">
                <AnalyticsBar label="Authenticity" value={authenticityPct} subtitle={`${uniqueFingerprints} unique devices`} />
                {poll.requireNames && (
                  <AnalyticsBar label="Named Voters" value={completionPct} subtitle={`${namedVoters} of ${totalVotes}`} />
                )}
                <AnalyticsBar label="Top Option Share" value={totalVotes > 0 ? Math.round((topOption.voteCount / totalVotes) * 100) : 0} subtitle={`${topOption.voteCount} votes`} />
                <p className="text-[9px] text-foreground/20 font-black uppercase tracking-widest text-center pt-2">
                  {poll.anonymizeData ? "IP & fingerprints anonymized" : "Live analytics · Poller"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatWidget({ icon, title, value, subtitle, highlight }: { icon: any; title: string; value: string; subtitle: string; highlight?: boolean }) {
  return (
    <div className="p-5 rounded-2xl bg-foreground/[0.03] border border-border space-y-2 hover:bg-foreground/[0.06] transition-all cursor-default group">
      <div className="flex items-center gap-2 text-foreground/40">
        <div className="group-hover:text-foreground transition-colors">{icon}</div>
        <span className="text-[9px] font-black uppercase tracking-widest">{title}</span>
      </div>
      <div className={`text-2xl font-black ${highlight ? "text-green-500" : ""}`}>{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest text-foreground/25">{subtitle}</div>
    </div>
  );
}

function AnalyticsBar({ label, value, subtitle }: { label: string; value: number; subtitle: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-foreground/40">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 bg-foreground/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-foreground rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-foreground/20">{subtitle}</p>
    </div>
  );
}
