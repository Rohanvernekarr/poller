import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import { UsersManager } from "../../components/UsersManager";
import { UsersSearchBar } from "../../components/UsersSearchBar";
import { Pagination } from "../../components/Pagination";
import { UserNav } from "../../components/UserNav";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function UsersPage({ searchParams: searchParamsPromise }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resolvedParams = await searchParamsPromise;
  const page = Math.max(1, Number(resolvedParams.page) || 1);
  const search = resolvedParams.search?.trim() || "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        _count: { select: { polls: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div>
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter">User Management</h1>
      <p className="text-gray-500 font-medium">
        Manage platform users, roles, and access control.
        {search && <span className="ml-2 text-primary">· Searching for "{search}"</span>}
      </p>
    </div>
        <UserNav />
      </header>

      <div className="space-y-6">
        <Suspense fallback={<div className="h-12 w-full animate-pulse bg-white/5 rounded-xl" />}>
          <UsersSearchBar defaultSearch={search} />
        </Suspense>
        <UsersManager users={users} />
        <Pagination total={total} page={page} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
