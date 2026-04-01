"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Vote, Activity, Users, Settings, ShieldAlert } from "lucide-react";
import { StatCard } from "../components/StatCard";

interface OverviewTabProps {
  polls: any[];
  users: any[];
  totalVotes: number;
  totalSessions: number;
  totalAccounts: number;
}

export function OverviewTab({ 
  polls, 
  users, 
  totalVotes, 
  totalSessions, 
  totalAccounts 
}: OverviewTabProps) {
  const suspiciousPolls = polls.filter(p => !p.allowMultipleVotes && p.suspiciousScore > 20);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Polls" value={polls.length} icon={Vote} color="blue" />
        <StatCard title="Total Votes" value={totalVotes} icon={Activity} color="pink" />
        <StatCard title="Total Users" value={users.length} icon={Users} color="indigo" />
        <StatCard title="Total Sessions" value={totalSessions} icon={Settings} color="amber" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              Recent Suspicious Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suspiciousPolls.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-sm font-medium text-white truncate max-w-[200px]">{p.title}</span>
                  <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-full">
                    {p.suspiciousScore}% Duplicates
                  </span>
                </div>
              ))}
              {suspiciousPolls.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No suspicious activity detected.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-green-400" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Active Accounts</div>
                <div className="text-2xl font-black text-white">{totalAccounts}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-xs text-gray-400 mb-1">Active Sessions</div>
                <div className="text-2xl font-black text-white">{totalSessions}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
