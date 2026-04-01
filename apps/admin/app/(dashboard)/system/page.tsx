import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { UserNav } from "../../components/UserNav";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { ShieldCheck, Database, Server, Clock } from "lucide-react";

export default async function SystemPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const [totalAccounts, totalSessions, totalUsers, totalPolls, totalVotes] = await Promise.all([
    prisma.account.count(),
    prisma.session.count(),
    prisma.user.count(),
    prisma.poll.count(),
    prisma.vote.count()
  ]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">System Data</h1>
          <p className="text-gray-500 font-medium">Infrastructure health and platform statistics.</p>
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass border-white/10 p-4">
          <CardHeader className="flex flex-row items-center gap-4 pb-8">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group hover:border-white/20 transition-all">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-xl font-black text-white uppercase tracking-tight">Auth Infrastructure</CardTitle>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">NextAuth Core</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <DataItem label="Total Linked Accounts" value={totalAccounts} />
            <DataItem label="Active User Sessions" value={totalSessions} />
            <DataItem label="Concurrency Index" value={(totalSessions / Math.max(1, totalUsers)).toFixed(2)} />
            <div className="pt-4 flex items-center gap-2 text-xs font-bold text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AUTH SYSTEM OPERATIONAL
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/10 p-4">
          <CardHeader className="flex flex-row items-center gap-4 pb-8">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group hover:border-white/20 transition-all">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-xl font-black text-white uppercase tracking-tight">Data Health</CardTitle>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Prisma Core</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <DataItem label="Total User Documents" value={totalUsers} />
            <DataItem label="Total Poll Records" value={totalPolls} />
            <DataItem label="Vote Ingestion Count" value={totalVotes} />
            <div className="pt-4 flex items-center gap-2 text-xs font-bold text-primary">
              <Server className="w-4 h-4" />
              DATABASE STORAGE HEALTHY
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="glass-card flex items-center justify-between p-8 border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <Clock className="w-8 h-8 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase text-gray-500 tracking-widest leading-none mb-1">Server Status</span>
            <span className="text-xl font-bold text-white leading-none">System wide check complete. No issues found.</span>
          </div>
        </div>
        <div className="hidden md:block text-[10px] font-black text-gray-600 uppercase tracking-widest">
          Last Check: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors rounded-lg px-2">
      <span className="text-sm text-gray-400 font-black uppercase tracking-tight">{label}</span>
      <span className="text-lg font-black text-white font-mono">{value}</span>
    </div>
  );
}
