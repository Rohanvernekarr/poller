"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Users, Clock, BarChart2, CheckCircle2, Globe, Fingerprint,
  MessageSquare, Shield, Share2, AlarmClock, Lock, Eye,
  Search, X, ChevronDown, ChevronUp
} from "lucide-react";

interface AdminPollDetailProps { poll: any; }

export function AdminPollDetail({ poll }: AdminPollDetailProps) {
  const [search, setSearch] = useState("");
  const [expandedOptions, setExpandedOptions] = useState(true);

  const filtered = poll.votes.filter((v: any) => {
    const q = search.toLowerCase();
    return (
      (v.voterName || "").toLowerCase().includes(q) ||
      (v.user?.email || "").toLowerCase().includes(q) ||
      (v.option?.text || "").toLowerCase().includes(q) ||
      (v.ipAddress || "").toLowerCase().includes(q)
    );
  });

  const isExpired = poll.expiresAt && new Date() > new Date(poll.expiresAt);

  return (
    <div className="space-y-6">
      {/* ── Top grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="Creator">
          <div className="space-y-1">
            <p className="text-white font-bold">{poll.creator?.name || "Unknown"}</p>
            <p className="text-gray-400 text-sm font-mono">{poll.creator?.email}</p>
            <p className="text-gray-600 text-xs">Joined {poll.creator?.createdAt ? formatDistanceToNow(new Date(poll.creator.createdAt), { addSuffix: true }) : "—"}</p>
          </div>
        </InfoCard>

        <InfoCard title="Timeline">
          <div className="space-y-1">
            <p className="text-white text-sm font-semibold">Created {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}</p>
            <p className="text-gray-500 text-xs font-mono">{new Date(poll.createdAt).toLocaleString()}</p>
            {poll.expiresAt ? (
              <p className={`text-xs font-black uppercase tracking-widest ${isExpired ? "text-red-400" : "text-yellow-400"}`}>
                {isExpired ? "Ended" : "Expires"} {formatDistanceToNow(new Date(poll.expiresAt), { addSuffix: true })}
              </p>
            ) : (
              <p className="text-gray-600 text-xs">No expiry set</p>
            )}
          </div>
        </InfoCard>

        <InfoCard title="Stats">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="text-gray-500">Total Votes</span><span className="text-white font-bold">{poll.totalVotes}</span>
            <span className="text-gray-500">Options</span><span className="text-white font-bold">{poll.options.length}</span>
            <span className="text-gray-500">Visibility</span><span className="text-white font-bold">{poll.resultsVisibility || "PUBLIC"}</span>
            <span className="text-gray-500">Status</span>
            <span className={`font-black text-xs uppercase ${isExpired ? "text-red-400" : "text-green-400"}`}>
              {isExpired ? "Closed" : "Live"}
            </span>
          </div>
        </InfoCard>
      </div>

      {/* ── Settings flags ── */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-wrap gap-3">
        <Flag icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Multiple Votes" active={poll.allowMultipleVotes} />
        <Flag icon={<Users className="w-3.5 h-3.5" />} label="Require Name" active={poll.requireNames} />
        <Flag icon={<Lock className="w-3.5 h-3.5" />} label="Require Auth" active={poll.requireAuth} />
        <Flag icon={<Globe className="w-3.5 h-3.5" />} label="Share Button" active={!poll.hideShareButton} />
        <Flag icon={<Shield className="w-3.5 h-3.5" />} label="Anonymize IP" active={poll.anonymizeData} />
        <Flag icon={<MessageSquare className="w-3.5 h-3.5" />} label="Comments" active={poll.allowComments} />
        {poll.allowedDomains && (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
            <Globe className="w-3 h-3" />Domain: {poll.allowedDomains}
          </span>
        )}
      </div>

      {/* ── Options breakdown ── */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        <button
          onClick={() => setExpandedOptions(o => !o)}
          className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
        >
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5" />Options Breakdown
          </span>
          {expandedOptions ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
        </button>
        {expandedOptions && (
          <div className="p-4 space-y-2">
            {poll.options.map((opt: any) => {
              const pct = poll.totalVotes === 0 ? 0 : Math.round((opt.voteCount / poll.totalVotes) * 100);
              return (
                <div key={opt.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span className="truncate max-w-[80%]">{opt.text}</span>
                    <span className="text-gray-500">{opt.voteCount} · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Voter transcript ── */}
      <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/[0.03] border-b border-white/[0.06]">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />Voter Transcript
            <span className="text-gray-600">({poll.votes.length})</span>
          </span>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search voters..."
              className="h-8 pl-8 pr-7 w-44 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-gray-600 border-b border-white/[0.04]">
          <span>#</span><span>Voter</span><span>Account</span><span>Voted For</span><span>IP / Device</span><span>When</span>
        </div>

        <div className="max-h-[520px] overflow-y-auto divide-y divide-white/[0.03]">
          {filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-600 text-xs font-black uppercase tracking-widest">No results.</p>
          ) : (
            filtered.map((vote: any, i: number) => (
              <div
                key={vote.id}
                className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-4 py-2.5 hover:bg-white/[0.03] transition-colors text-xs"
              >
                <span className="text-gray-600 tabular-nums text-[10px]">{i + 1}</span>

                {/* Voter name */}
                <div className="min-w-0">
                  <p className="text-gray-200 font-semibold truncate">{vote.voterName || "Anonymous"}</p>
                </div>

                {/* Account */}
                <div className="min-w-0">
                  {vote.user ? (
                    <div>
                      <p className="text-gray-300 truncate text-[10px] font-mono">{vote.user.email}</p>
                      <p className="text-gray-600 truncate text-[9px]">{vote.user.name}</p>
                    </div>
                  ) : (
                    <span className="text-gray-600 text-[10px] font-black uppercase">Guest</span>
                  )}
                </div>

                {/* Option voted for */}
                <span className="text-gray-300 truncate">{vote.option?.text}</span>

                {/* IP & fingerprint */}
                <div className="space-y-0.5 min-w-0">
                  {vote.ipAddress && vote.ipAddress !== "Redacted" ? (
                    <p className="text-gray-500 font-mono text-[10px] truncate flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5 flex-shrink-0" />{vote.ipAddress}
                    </p>
                  ) : (
                    <p className="text-gray-700 text-[10px] uppercase font-black">Redacted</p>
                  )}
                  {vote.fingerprintHash && vote.fingerprintHash !== "Redacted" && (
                    <p className="text-gray-700 font-mono text-[9px] truncate flex items-center gap-1">
                      <Fingerprint className="w-2.5 h-2.5 flex-shrink-0" />{vote.fingerprintHash.slice(0, 12)}…
                    </p>
                  )}
                </div>

                {/* Time */}
                <span className="text-gray-600 text-[10px] whitespace-nowrap tabular-nums">
                  {formatDistanceToNow(new Date(vote.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))
          )}
        </div>

        {search && (
          <div className="px-5 py-3 border-t border-white/[0.04] text-[10px] font-black uppercase tracking-widest text-gray-600">
            {filtered.length} of {poll.votes.length} votes
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">{title}</p>
      {children}
    </div>
  );
}

function Flag({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${active ? "bg-white/5 border-white/10 text-gray-300" : "bg-transparent border-white/[0.04] text-gray-700"}`}>
      {icon}{label}
    </span>
  );
}
