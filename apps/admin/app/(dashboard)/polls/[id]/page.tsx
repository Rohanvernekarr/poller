import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { AdminPollDetail } from "../../../components/AdminPollDetail";
import { UserNav } from "../../../components/UserNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const VOTE_PAGE_SIZE = 50;

export default async function AdminPollDetailPage({ 
  params, 
  searchParams: searchParamsPromise 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ vPage?: string; vSearch?: string }>
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [{ id }, searchParams] = await Promise.all([params, searchParamsPromise]);
  const vPage = Math.max(1, Number(searchParams.vPage) || 1);
  const vSearch = searchParams.vSearch?.trim() || "";

  const voteWhere = {
    pollId: id,
    ...(vSearch && {
      OR: [
        { voterName: { contains: vSearch, mode: "insensitive" as const } },
        { user: { email: { contains: vSearch, mode: "insensitive" as const } } },
        { ipAddress: { contains: vSearch, mode: "insensitive" as const } },
      ],
    }),
  };

  const [poll, votes, totalVotesCount] = await Promise.all([
    prisma.poll.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true, createdAt: true } },
        options: {
          include: { _count: { select: { votes: true } } },
        },
        _count: { select: { votes: true } },
      },
    }),
    prisma.vote.findMany({
      where: voteWhere,
      orderBy: { createdAt: "desc" },
      take: VOTE_PAGE_SIZE,
      skip: (vPage - 1) * VOTE_PAGE_SIZE,
      include: {
        option: { select: { text: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.vote.count({ where: voteWhere }),
  ]);

  if (!poll) notFound();

  const formatted = {
    ...poll,
    totalVotes: (poll as any)._count.votes,
    options: (poll as any).options.map((opt: any) => ({ ...opt, voteCount: opt._count.votes })),
    votes,
    totalVotesCount,
    vPage,
    vSearch,
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
