import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { AdminUserDetail } from "../../../components/AdminUserDetail";
import { UserNav } from "../../../components/UserNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20; // Smaller page size because we have two tables

export default async function AdminUserDetailPage({ 
  params, 
  searchParams: searchParamsPromise 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ pPage?: string; vPage?: string; cPage?: string }>
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [{ id }, searchParams] = await Promise.all([params, searchParamsPromise]);
  const pPage = Math.max(1, Number(searchParams.pPage) || 1);
  const vPage = Math.max(1, Number(searchParams.vPage) || 1);
  const cPage = Math.max(1, Number(searchParams.cPage) || 1);

  const [user, polls, votes, comments] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            polls: true,
            votes: true,
            comments: true,
          }
        }
      }
    }),
    prisma.poll.findMany({
      where: { creatorId: id },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (pPage - 1) * PAGE_SIZE,
      include: { _count: { select: { votes: true } } }
    }),
    prisma.vote.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (vPage - 1) * PAGE_SIZE,
      include: {
        poll: { select: { id: true, title: true } },
        option: { select: { text: true } }
      }
    }),
    prisma.comment.findMany({
      where: { authorId: id },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (cPage - 1) * PAGE_SIZE,
      include: {
        poll: { select: { id: true, title: true } }
      }
    })
  ]);

  if (!user) notFound();

  const lastActiveAt = new Date(Math.max(
    new Date(user.createdAt).getTime(),
    polls[0]?.createdAt.getTime() || 0,
    votes[0]?.createdAt.getTime() || 0,
    comments[0]?.createdAt.getTime() || 0
  ));

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Link href="/users" className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Users
          </Link>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">User Profile</h1>
          <p className="text-gray-500 text-sm font-medium">Internal ID: <span className="font-mono text-gray-400">{user.id}</span></p>
        </div>
        <UserNav />
      </header>

      <AdminUserDetail 
        user={{
          ...user,
          polls,
          votes,
          comments,
          pPage,
          vPage,
          cPage,
          lastActiveAt,
          pageSize: PAGE_SIZE
        }} 
      />
    </div>
  );
}
