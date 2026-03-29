import { prisma } from "@repo/db";
import { notFound } from "next/navigation";
import { PollUI } from "./PollUI";
import { cookies } from "next/headers";

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const poll = await prisma.poll.findUnique({
    where: { id },
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true }
          }
        }
      },
      _count: {
        select: { votes: true }
      }
    }
  });

  if (!poll) {
    notFound();
  }

  const cookieStore = await cookies();
  const hasVoted = cookieStore.get(`voted_${poll.id}`)?.value === "true";

  return (
    <div className="min-h-screen py-20 px-6 max-w-2xl mx-auto flex flex-col justify-center">
      <PollUI 
        initialPoll={{
          id: poll.id,
          title: poll.title,
          description: poll.description,
          options: poll.options.map((opt: any) => ({ ...opt, voteCount: opt._count.votes })),
          totalVotes: poll._count.votes,
          allowMultipleVotes: poll.allowMultipleVotes,
          requireNames: poll.requireNames,
          hasOtherOption: poll.hasOtherOption,
          allowComments: poll.allowComments,
          hideShareButton: poll.hideShareButton,
          anonymizeData: poll.anonymizeData,
          resultsVisibility: poll.resultsVisibility,
        }} 
        hasVotedInitial={hasVoted && !poll.allowMultipleVotes} 
      />
    </div>
  );
}
