"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { 
  User, Mail, Shield, Calendar, Activity, Vote, 
  ChevronDown, ChevronUp, Clock, ExternalLink,
  ShieldAlert, ShieldCheck, MessageSquare, List
} from "lucide-react";
import Link from "next/link";
import { Pagination } from "./Pagination";

interface AdminUserDetailProps {
  user: any;
}

export function AdminUserDetail({ user }: AdminUserDetailProps) {
  const [expandPolls, setExpandPolls] = useState(true);
  const [expandVotes, setExpandVotes] = useState(true);
  const [expandComments, setExpandComments] = useState(true);

  const createdPolls = user.polls || [];
  const votingHistory = user.votes || [];
  const commentsMade = user.comments || [];
  
  const totalPolls = user._count?.polls || 0;
  const totalVotes = user._count?.votes || 0;
  const totalComments = user._count?.comments || 0;

  return (
    <div className="space-y-8">
      {/* User Overview Identity  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-black text-white uppercase shrink-0">
            {user.name?.[0] || user.email?.[0] || "?"}
          </div>
          <div className="space-y-4 flex-1 min-w-0">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight truncate">
                {user.name || "Anonymous User"}
              </h2>
              <p className="text-gray-500 font-mono text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                user.role === "ADMIN" ? "bg-primary/20 border-primary/30 text-white" : "bg-white/5 border-white/10 text-gray-400"
              }`}>
                {user.role}
              </span>
              <span className={`flex items-center gap-1.5 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                user.isBlocked ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"
              }`}>
                {user.isBlocked ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {user.isBlocked ? "Access Revoked" : "Authorized"}
              </span>
              <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatMiniCard 
            title="Polls Created" 
            value={totalPolls} 
            icon={<Shield className="w-4 h-4" />} 
          />
          <StatMiniCard 
            title="Votes Cast" 
            value={totalVotes} 
            icon={<Vote className="w-4 h-4" />} 
          />
          <StatMiniCard 
            title="Comments" 
            value={totalComments} 
            icon={<MessageSquare className="w-4 h-4" />} 
          />
          <StatMiniCard 
            title="Last Active" 
            value="Today" 
            icon={<Clock className="w-4 h-4" />} 
          />
        </div>
      </div>

      {/* Created Polls*/}
      <section className="rounded-3xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
        <button 
          onClick={() => setExpandPolls(!expandPolls)}
          className="w-full flex items-center justify-between px-8 py-6 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Polls Authored <span className="text-gray-600 ml-2">({totalPolls})</span></h3>
          </div>
          {expandPolls ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </button>
        {expandPolls && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
            {createdPolls.length === 0 ? (
              <p className="col-span-full py-12 text-center text-gray-600 font-bold uppercase tracking-widest text-xs italic">User has not created any polls yet.</p>
            ) : (
              createdPolls.map((poll: any) => (
                <Link key={poll.id} href={`/polls/${poll.id}`}>
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group cursor-pointer h-full flex flex-col justify-between">
                    <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-2 uppercase tracking-tight mb-4">{poll.title}</h4>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                      </span>
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase">
                        <ExternalLink className="w-3 h-3" /> Inspect
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
        {expandPolls && totalPolls > user.pageSize && (
          <div className="px-8 py-4 border-t border-white/[0.03] bg-white/[0.01]">
            <Pagination 
              total={totalPolls} 
              page={user.pPage} 
              pageSize={user.pageSize} 
              paramName="pPage" 
            />
          </div>
        )}
      </section>

      {/* Voting History  */}
      <section className="rounded-3xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
        <button 
          onClick={() => setExpandVotes(!expandVotes)}
          className="w-full flex items-center justify-between px-8 py-6 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Vote className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Voting History <span className="text-gray-600 ml-2">({totalVotes})</span></h3>
          </div>
          {expandVotes ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </button>
        {expandVotes && (
          <div className="divide-y divide-white/[0.03]">
            {votingHistory.length === 0 ? (
              <p className="py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs italic">User has not cast any votes yet.</p>
            ) : (
              votingHistory.map((vote: any) => (
                <div key={vote.id} className="px-8 py-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Link href={`/polls/${vote.poll.id}`} className="hover:underline">
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate max-w-md">{vote.poll.title}</h4>
                    </Link>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Selected:</span>
                       <span className="text-xs font-bold text-primary">{vote.option.text}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-gray-500 tabular-nums">{new Date(vote.createdAt).toLocaleDateString()}</span>
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{new Date(vote.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <Link href={`/polls/${vote.poll.id}`}>
                      <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {expandVotes && totalVotes > user.pageSize && (
          <div className="px-8 py-4 border-t border-white/[0.03] bg-white/[0.01]">
            <Pagination 
              total={totalVotes} 
              page={user.vPage} 
              pageSize={user.pageSize} 
              paramName="vPage" 
            />
          </div>
        )}
      </section>

      {/* ── Comments Made ── */}
      <section className="rounded-3xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
        <button 
          onClick={() => setExpandComments(!expandComments)}
          className="w-full flex items-center justify-between px-8 py-6 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Comments Made <span className="text-gray-600 ml-2">({totalComments})</span></h3>
          </div>
          {expandComments ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
        </button>
        {expandComments && (
          <div className="divide-y divide-white/[0.03]">
            {commentsMade.length === 0 ? (
              <p className="py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs italic">User has not made any comments yet.</p>
            ) : (
              commentsMade.map((comment: any) => (
                <div key={comment.id} className="px-8 py-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-300 italic">
                      "{comment.text}"
                    </div>
                    {comment.poll && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">On Poll:</span>
                        <Link href={`/polls/${comment.poll.id}`} className="text-xs font-bold text-primary hover:underline truncate">
                          {comment.poll.title}
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-right shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-gray-500 tabular-nums">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{new Date(comment.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <Link href={`/polls/${comment.poll?.id}`}>
                      <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {expandComments && totalComments > user.pageSize && (
          <div className="px-8 py-4 border-t border-white/[0.03] bg-white/[0.01]">
            <Pagination 
              total={totalComments} 
              page={user.cPage} 
              pageSize={user.pageSize} 
              paramName="cPage" 
            />
          </div>
        )}
      </section>
    </div>
  );
}

function StatMiniCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-colors flex flex-col justify-center gap-1 group">
      <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-300 transition-colors">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest leading-none">{title}</span>
      </div>
      <span className="text-xl font-bold text-white tabular-nums leading-none mt-1">{value}</span>
    </div>
  );
}
