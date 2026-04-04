import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { StatCard } from "../components/StatCard";
import { UserNav } from "../components/UserNav";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/card";
import { Vote, Activity, Users, Settings, ShieldAlert } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [totalPolls, totalVotes, totalUsers, totalSessions, recentUsers, suspiciousPolls] = await Promise.all([
    prisma.poll.count(),
    prisma.vote.count(),
    prisma.user.count(),
    prisma.session.count(),
    prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, createdAt: true } }),
    prisma.$queryRaw<{ id: string; title: string; score: number }[]>`
      SELECT p.id, p.title,
        GREATEST(0, 100 - ROUND(
          COUNT(DISTINCT v."ipAddress")::numeric / NULLIF(COUNT(v.id), 0) * 100
        )) AS score
      FROM "Poll" p
      JOIN "Vote" v ON v."pollId" = p.id
      WHERE p."allowMultipleVotes" = false
      GROUP BY p.id, p.title
      HAVING GREATEST(0, 100 - ROUND(
        COUNT(DISTINCT v."ipAddress")::numeric / NULLIF(COUNT(v.id), 0) * 100
      )) > 20
      ORDER BY score DESC
      LIMIT 5
    `,
  ]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Overview</h1>
          <p className="text-gray-500 font-medium">Platform-wide activity and security metrics.</p>
        </div>
        <UserNav />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Polls" value={totalPolls} icon={Vote} color="blue" />
        <StatCard title="Total Votes" value={totalVotes} icon={Activity} color="pink" />
        <StatCard title="Total Users" value={totalUsers} icon={Users} color="indigo" />
        <StatCard title="Total Sessions" value={totalSessions} icon={Settings} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-white/10 p-4">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-tight">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suspiciousPolls.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white truncate max-w-[250px]">{p.title}</span>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Potential Bot Voting</span>
                  </div>
                  <span className="text-xs font-black text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20 group-hover:scale-105 transition-transform">
                    {Number(p.score)}% Duplicates
                  </span>
                </div>
              ))}
              {suspiciousPolls.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                    <ShieldAlert className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">All polls are currently healthy.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 p-4">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-tight">
              <Users className="w-6 h-6 text-primary" />
              Recent Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{u.name || "Anonymous User"}</span>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{u.email}</span>
                  </div>
                  <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
