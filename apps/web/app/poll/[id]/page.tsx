import { prisma } from "@repo/db";
import { notFound } from "next/navigation";
import { PollUI } from "./PollUI";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [session, poll, cookieStore] = await Promise.all([
    getServerSession(authOptions),
    prisma.poll.findUnique({
      where: { id },
      include: {
        creator: { select: { name: true, email: true } },
        options: { include: { _count: { select: { votes: true } } } },
        _count: { select: { votes: true } }
      }
    }),
    cookies()
  ]);

  if (!poll) {
    notFound();
  }

  const isOwner = session?.user?.id === poll.creatorId;
  const hasVoted = cookieStore.get(`voted_${poll.id}`)?.value === "true";

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 w-full max-w-7xl mx-auto">
      <PollUI 
        isOwner={isOwner}
        initialPoll={{
          id: poll.id,
          title: poll.title,
          description: poll.description,
          creator: poll.creator || undefined,
          createdAt: poll.createdAt,
          options: poll.options.map((opt: any) => ({ ...opt, voteCount: opt._count.votes })),
          totalVotes: poll._count.votes,
          allowMultipleVotes: poll.allowMultipleVotes,
          requireNames: poll.requireNames,
          hasOtherOption: poll.hasOtherOption,
          allowComments: poll.allowComments,
          hideShareButton: poll.hideShareButton,
          anonymizeData: poll.anonymizeData,
          resultsVisibility: poll.resultsVisibility,
          allowedDomains: (poll as any).allowedDomains,
          expiresAt: poll.expiresAt,
        }} 
        hasVotedInitial={hasVoted && !poll.allowMultipleVotes} 
      />
    </div>
  );
}