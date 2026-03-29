"use server";

import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createPoll(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const allowMultipleVotes = formData.get("allowMultipleVotes") === "true";
  const requireNames = formData.get("requireNames") === "true";
  const hasOtherOption = formData.get("hasOtherOption") === "true";
  const allowComments = formData.get("allowComments") === "true";
  const hideShareButton = formData.get("hideShareButton") === "true";
  const anonymizeData = formData.get("anonymizeData") === "true";
  const resultsVisibility = (formData.get("resultsVisibility") || "PUBLIC") as string;

  // Extract all options
  const options: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("option-") && typeof value === "string" && value.trim()) {
      options.push(value.trim());
    }
  }

  if (!title || options.length < 2) {
    throw new Error("Invalid poll data. Need a title and at least 2 options.");
  }

  if (hasOtherOption) {
    options.push("Other (Please specify)");
  }

  const poll = await prisma.poll.create({
    data: {
      title,
      description,
      allowMultipleVotes,
      requireNames,
      hasOtherOption,
      allowComments,
      hideShareButton,
      anonymizeData,
      resultsVisibility,
      creatorId: userId,
      options: {
        create: options.map((opt) => ({
          text: opt,
        })),
      },
    },
  });

  // Redirect to dashboard if logged in, otherwise to poll page
  if (userId) {
    redirect("/dashboard");
  } else {
    redirect(`/poll/${poll.id}`);
  }
}

export async function deletePoll(pollId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: { creatorId: true },
  });

  if (poll?.creatorId !== session.user.id) {
    throw new Error("You do not have permission to delete this poll.");
  }

  await prisma.poll.delete({
    where: { id: pollId },
  });

  revalidatePath("/dashboard");
}

export async function updatePollSettings(pollId: string, data: {
  allowComments?: boolean;
  resultsVisibility?: string;
  allowMultipleVotes?: boolean;
  hideShareButton?: boolean;
  anonymizeData?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: { creatorId: true },
  });

  if (poll?.creatorId !== session.user.id) {
    throw new Error("You do not have permission to update this poll.");
  }

  await prisma.poll.update({
    where: { id: pollId },
    data,
  });

  revalidatePath(`/poll/${pollId}`);
  revalidatePath("/dashboard");
}

export async function getPollResults(pollId: string) {
  const session = await getServerSession(authOptions);
  
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      creator: { select: { name: true, email: true } },
      options: {
        include: { _count: { select: { votes: true } } }
      },
      votes: {
        orderBy: { createdAt: "desc" },
        include: { option: { select: { text: true } } }
      },
      _count: { select: { votes: true } }
    }
  });

  if (!poll) throw new Error("Poll not found");

  const isOwner = session?.user?.id === poll.creatorId;
  const isPublic = poll.resultsVisibility === "PUBLIC";

  if (!isOwner && !isPublic) {
    throw new Error("You do not have permission to view these analytics.");
  }

  return {
    ...poll,
    isOwner,
    totalVotes: poll._count.votes,
    options: poll.options.map((opt: any) => ({
      ...opt,
      voteCount: opt._count.votes
    })),
    votes: poll.votes.map((v: any) => ({
      ...v,
      // Mask IP/Fingerprint for non-owners
      ipAddress: isOwner && !poll.anonymizeData ? v.ipAddress : "Redacted",
      fingerprintHash: isOwner ? v.fingerprintHash : "Redacted"
    }))
  };
}
