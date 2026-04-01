"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { ShieldCheck, Database } from "lucide-react";

interface SystemTabProps {
  totalAccounts: number;
  totalSessions: number;
  totalUsers: number;
  totalPolls: number;
  totalVotes: number;
}

export function SystemTab({ 
  totalAccounts, 
  totalSessions, 
  totalUsers, 
  totalPolls, 
  totalVotes 
}: SystemTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-300">
      <Card className="glass border-white/10">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-bold text-white">Auth Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataItem label="Total OAuth Accounts" value={totalAccounts} />
          <DataItem label="Active User Sessions" value={totalSessions} />
          <DataItem label="Avg Sessions / User" value={(totalSessions / Math.max(1, totalUsers)).toFixed(2)} />
        </CardContent>
      </Card>
      
      <Card className="glass border-white/10">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-bold text-white">Data Infrastructure</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataItem label="Total Polls" value={totalPolls} />
          <DataItem label="Total Votes Cast" value={totalVotes} />
          <DataItem label="Votes Per Poll" value={(totalVotes / Math.max(1, totalPolls)).toFixed(1)} />
        </CardContent>
      </Card>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-400 font-medium">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  );
}
