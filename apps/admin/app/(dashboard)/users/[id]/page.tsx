import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { AdminUserDetail } from "../../../components/AdminUserDetail";
import { UserNav } from "../../../components/UserNav";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      polls: {
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { votes: true } } }
      },
      votes: {
        orderBy: { createdAt: "desc" },
        include: {
          poll: { select: { id: true, title: true } },
          option: { select: { text: true } }
        }
      },
      _count: {
        select: {
          polls: true,
          votes: true,
          comments: true
        }
      }
    }
  });

  if (!user) notFound();

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

      <AdminUserDetail user={user} />
    </div>
  );
}
