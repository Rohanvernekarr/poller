import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { PollsManager } from "../../components/PollsManager";
import { UserNav } from "../../components/UserNav";

export default async function PollsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const polls = await prisma.poll.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { votes: true }
      },
      votes: {
        select: { id: true, ipAddress: true }
      }
    }
  });

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
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Poll Moderation</h1>
          <p className="text-gray-500 font-medium">Monitor voting activity and manage platform content.</p>
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </header>

      <PollsManager initialPolls={enrichedPolls} />
    </div>
  );
}
