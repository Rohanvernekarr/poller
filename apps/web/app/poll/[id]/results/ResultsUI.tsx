"use client";

import { motion } from "framer-motion";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { 
  BarChart3, Users, Calendar, TrendingUp, Trophy, Clock, Download,
  ShieldCheck, MoreHorizontal 
} from "lucide-react";
import { PollResults } from "../components/PollResults";
import { TechnicalBackButton } from "../../../components/TechnicalBackButton";

interface ResultsUIProps { poll: any; }

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

export default function ResultsUI({ poll }: ResultsUIProps) {
  const totalVotes: number = poll?.totalVotes || 0;
  const votes: any[] = poll?.votes || [];

  const topOption = poll?.options?.length > 0
    ? poll.options.reduce((prev: any, curr: any) => prev.voteCount > curr.voteCount ? prev : curr)
    : { text: "No options", voteCount: 0 };

  // ── Analytics Logic ───────────────────────────────────
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

  const uniqueFingerprints = new Set(votes.map(v => v.fingerprintHash).filter(Boolean)).size;
  const authenticityPct = totalVotes === 0 ? 100 : Math.round((uniqueFingerprints / totalVotes) * 100);

  const namedVoters = votes.filter(v => v.voterName && v.voterName !== "Guest Voter").length;
  const completionPct = totalVotes === 0 ? 0 : Math.round((namedVoters / totalVotes) * 100);

  return (
    <>
      {/* ── Web Interface (Hidden during print) ─────────────────────────── */}
      <div className="space-y-10 selection:bg-foreground/20 selection:text-foreground print:hidden">
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Results Chart */}
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
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Audit Trail</span>
                  </div>
                </div>

                <div className="max-h-[480px] overflow-y-auto px-1 space-y-0.5">
                  {votes.length === 0 ? (
                    <p className="text-center py-10 text-foreground/30 font-black uppercase tracking-widest text-[10px]">No votes recorded yet.</p>
                  ) : (
                    votes.map((vote: any, i: number) => (
                      <div key={vote.id} className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-foreground/[0.04]">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-foreground/20 italic">#{i + 1}</span>
                          <span className="text-[11px] font-black text-foreground/80">{vote.voterName || "Anonymous"}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-foreground/50 italic">{vote.option.text}</p>
                          <p className="text-[8px] font-black text-foreground/20 uppercase tracking-widest">
                            {new Date(vote.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Widgets */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
            <div className="p-7 rounded-[2rem] bg-foreground text-background shadow-2xl relative overflow-hidden">
              <div className="relative space-y-3">
                <div className="flex items-center gap-2 opacity-60">
                  <Trophy className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Leading Option</span>
                </div>
                <h3 className="text-2xl font-black leading-tight uppercase line-clamp-2">
                  {topOption.voteCount > 0 ? topOption.text : "No Lead"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatWidget icon={<TrendingUp className="w-4 h-4" />} title="Growth" value={growthPct > 0 ? `+${growthPct}%` : `${growthPct}%`} subtitle="vs prev 24h" highlight={growthPct > 0} />
              <StatWidget icon={<Clock className="w-4 h-4" />} title="Activity" value={String(votesLast24h)} subtitle="Last 24h" />
            </div>

            <div className="rounded-[2rem] border border-border bg-background/50 p-6 space-y-5">
              <AnalyticsBar label="Authenticity" value={authenticityPct} subtitle="Unique Devices" />
              <AnalyticsBar label="Names Provided" value={completionPct} subtitle="Voter metadata" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Print Interface (Clean Report View) ───────────────────────────── */}
      <div className="hidden print:block bg-white text-black p-6 font-sans min-h-screen">
        <header className="border-b-4 border-black pb-4 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-extrabold uppercase tracking-tighter mb-1">{poll.title}</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Official Analytics Report</p>
            </div>
            <div className="text-right text-xs font-black uppercase tracking-widest leading-relaxed">
              <p>Generated: {new Date().toLocaleString()}</p>
              <p>Created: {new Date(poll.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>Total Votes: {totalVotes}</span>
            <span>Security: {poll.anonymizeData ? "High (Anonymized)" : "Standard"}</span>
            <span>Status: Final Results</span>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-lg font-black uppercase mb-4 border-b-2 border-black pb-2">1. Result Summary</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-black text-[10px] font-black uppercase tracking-widest">
                <th className="py-2 px-4 whitespace-nowrap">Choice Selection</th>
                <th className="py-2 px-4 text-center">Position</th>
                <th className="py-2 px-4 text-right">Vote Count</th>
                <th className="py-2 px-4 text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {poll.options.sort((a: any, b: any) => b.voteCount - a.voteCount).map((opt: any, i: number) => {
                const pct = totalVotes === 0 ? 0 : Math.round((opt.voteCount / totalVotes) * 100);
                return (
                  <tr key={opt.id} className="border-b border-gray-100">
                    <td className="py-2 px-4 font-bold text-xs uppercase">{opt.text}</td>
                    <td className="py-2 px-4 text-center text-[10px] font-black text-gray-300">#{i + 1}</td>
                    <td className="py-2 px-4 text-right font-bold tabular-nums text-xs">{opt.voteCount}</td>
                    <td className="py-2 px-4 text-right font-bold tabular-nums text-xs">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-black uppercase mb-4 border-b-2 border-black pb-2">2. Engagement Metrics</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 border border-gray-100 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Winning Strategy</p>
              <p className="text-base font-black uppercase">{topOption.voteCount > 0 ? topOption.text : "N/A"}</p>
            </div>
            <div className="p-4 border border-gray-100 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Device Integrity</p>
              <p className="text-base font-black uppercase">{authenticityPct}% Authentic</p>
            </div>
            <div className="p-4 border border-gray-100 rounded-2xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Metadata Capture</p>
              <p className="text-base font-black uppercase">{completionPct}% Identifiable</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-black uppercase mb-4 border-b-2 border-black pb-2">3. Audit History</h2>
          <table className="w-full text-left border-collapse text-[10px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 uppercase font-black tracking-widest text-gray-400">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Voter Identity</th>
                <th className="py-2 px-4">Selected Option</th>
                <th className="py-2 px-4 text-right">Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote: any, i: number) => (
                <tr key={vote.id} className="border-b border-gray-50">
                    <td className="py-1.5 px-4 text-gray-300">{(i + 1).toString().padStart(3, '0')}</td>
                    <td className="py-1.5 px-4 font-bold">{vote.voterName || "Anonymous"}</td>
                    <td className="py-1.5 px-4 font-bold italic text-gray-600 truncate max-w-[200px]">"{vote.option.text}"</td>
                    <td className="py-1.5 px-4 text-right tabular-nums text-gray-400">
                      {new Date(vote.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </>
    );
  }
