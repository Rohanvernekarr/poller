import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const [polls, users, totalAccounts, totalSessions] = await Promise.all([
    prisma.poll.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { votes: true }
        },
        votes: {
          select: { id: true, ipAddress: true }
        }
      }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { polls: true }
        }
      }
    }),
    prisma.account.count(),
    prisma.session.count(),
  ]);

  const totalPolls = polls.length;
  const totalVotes = polls.reduce((acc: number, poll: any) => acc + poll._count.votes, 0);
  const totalUsers = users.length;

  const enrichedPolls = polls.map((poll: any) => {
    const uniqueIps = new Set(poll.votes.map((v: any) => v.ipAddress)).size;
    const suspiciousScore = poll._count.votes > 0 
      ? Math.max(0, 100 - Math.round((uniqueIps / poll._count.votes) * 100))
      : 0;

    return {
      id: poll.id,
      title: poll.title,
      createdAt: poll.createdAt,
      totalVotes: poll._count.votes,
      suspiciousScore,
      allowMultipleVotes: poll.allowMultipleVotes
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-8 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
            <p className="text-gray-500">Manage and monitor the Poller platform.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium px-4 py-2 bg-foreground/5 rounded-full border border-foreground/10">
              {session.user?.email}
            </div>
            {/* Can add sign out action here via client component */}
          </div>
        </header>

        <DashboardClient 
          initialPolls={enrichedPolls} 
          initialUsers={users}
          totalVotes={totalVotes} 
          totalPolls={totalPolls}
          totalUsers={totalUsers}
          totalAccounts={totalAccounts}
          totalSessions={totalSessions}
        />
      </div>
    </div>
  );
}
