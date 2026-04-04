import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import { PollsManager } from "../../components/PollsManager";
import { PollsSearchBar } from "../../components/PollsSearchBar";
import { Pagination } from "../../components/Pagination";
import { UserNav } from "../../components/UserNav";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; filter?: string }>;
}

export default async function PollsPage({ searchParams: searchParamsPromise }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resolvedParams = await searchParamsPromise;
  const page = Math.max(1, Number(resolvedParams.page) || 1);
  const search = resolvedParams.search?.trim() || "";
  const suspiciousOnly = resolvedParams.filter === "suspicious";

  const where = {
    ...(search && { title: { contains: search, mode: "insensitive" as const } }),
    ...(suspiciousOnly && { allowMultipleVotes: false }),
  };

  const [total, rawPolls] = await Promise.all([
    prisma.poll.count({ where }),
    prisma.poll.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        id: true,
        title: true,
        createdAt: true,
        allowMultipleVotes: true,
        _count: { select: { votes: true } },
      },
    }),
  ]);

  const pollIds = rawPolls.map((p) => p.id);

  const ipGroups = pollIds.length
    ? await prisma.$queryRawUnsafe<{ poll_id: string; unique_ips: bigint }[]>(
        `SELECT "pollId" AS poll_id, COUNT(DISTINCT "ipAddress") AS unique_ips
         FROM "Vote" WHERE "pollId" = ANY($1::text[]) GROUP BY "pollId"`,
        pollIds
      )
    : [];

  const ipMap = new Map(ipGroups.map((r) => [r.poll_id, Number(r.unique_ips)]));

  const polls = rawPolls.map((p) => {
    const total = p._count.votes;
    const unique = ipMap.get(p.id) ?? total;
    const suspiciousScore = total > 0 ? Math.max(0, 100 - Math.round((unique / total) * 100)) : 0;
    return { id: p.id, title: p.title, createdAt: p.createdAt, totalVotes: total, suspiciousScore, allowMultipleVotes: p.allowMultipleVotes };
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div>
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Poll Moderation</h1>
      <p className="text-gray-500 font-medium">
        Monitor voting activity and manage platform content.
        {search && <span className="ml-2 text-primary">· Searching for "{search}"</span>}
      </p>
    </div>
        <UserNav />
      </header>

      <div className="space-y-6">
        <Suspense fallback={<div className="h-12 w-full animate-pulse bg-white/5 rounded-xl" />}>
          <PollsSearchBar defaultSearch={search} defaultFilter={suspiciousOnly} />
        </Suspense>
        <PollsManager polls={polls} />
        <Pagination total={total} page={page} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
