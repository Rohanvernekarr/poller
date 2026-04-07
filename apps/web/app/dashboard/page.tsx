import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import { DashboardContent } from "./components/DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const [polls, userVotes] = await Promise.all([
    prisma.poll.findMany({
      where: { creatorId: session.user.id },
      include: {
        options: {
          include: {
            _count: { select: { votes: true } }
          }
        },
        _count: { select: { votes: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.vote.findMany({
      where: { userId: session.user.id },
      include: {
        poll: {
          include: {
            options: {
              include: {
                _count: { select: { votes: true } }
              }
            },
            _count: { select: { votes: true } }
          }
        },
        option: true
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24 pb-20">
      <DashboardContent polls={polls} userVotes={userVotes} />
    </div>
  );
}
