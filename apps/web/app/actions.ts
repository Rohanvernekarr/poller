"use server";

import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

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

  // Redirect to the newly created poll
  redirect(`/poll/${poll.id}`);
}
