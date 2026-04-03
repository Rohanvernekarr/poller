import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { AdminPollDetail } from "../../../components/AdminPollDetail";
import { UserNav } from "../../../components/UserNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminPollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const poll = await prisma.poll.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true, createdAt: true } },
      options: {
        include: { _count: { select: { votes: true } } },
      },
      votes: {
        orderBy: { createdAt: "desc" },
        include: {
          option: { select: { text: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      },
      _count: { select: { votes: true } },
    },
  });

  if (!poll) notFound();

  const formatted = {
    ...poll,
    totalVotes: (poll as any)._count.votes,
    options: (poll as any).options.map((opt: any) => ({ ...opt, voteCount: opt._count.votes })),
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Link href="/polls" className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Polls
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight line-clamp-2">{poll.title}</h1>
          <p className="text-gray-500 text-sm font-medium">Poll ID: <span className="font-mono text-gray-400">{poll.id}</span></p>
        </div>
        <UserNav />
      </header>

      <AdminPollDetail poll={formatted} />
    </div>
  );
}
