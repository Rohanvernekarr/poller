import { prisma } from "@repo/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import { UsersManager } from "../../components/UsersManager";
import { UserNav } from "../../components/UserNav";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { polls: true }
      }
    }
  });

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">User Management</h1>
          <p className="text-gray-500 font-medium">Manage platform users, roles, and access control.</p>
        </div>
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </header>

      <UsersManager initialUsers={users} />
    </div>
  );
}
