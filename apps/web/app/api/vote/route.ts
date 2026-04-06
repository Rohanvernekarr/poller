import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";
import { generateServerFingerprint } from "@repo/utils";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    let { pollId, optionId, fingerprintClient, voterName, customAnswer } = await req.json();

    if (!pollId || !optionId) {
      return NextResponse.json({ error: "Missing pollId or optionId" }, { status: 400 });
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    if (poll.expiresAt && new Date() > new Date(poll.expiresAt)) {
      return NextResponse.json({ error: "This poll has ended and is no longer accepting votes." }, { status: 403 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    if (session?.user && !voterName) {
      voterName = session.user.name || null;
    }

    if (poll.requireAuth) {
      if (!session?.user) {
        return NextResponse.json({ error: "You must be signed in to vote on this poll" }, { status: 401 });
      }
    }

    if (poll.allowedDomains) {
      if (!session?.user?.email) {
        return NextResponse.json({ error: "You must be signed in to vote on this restricted poll" }, { status: 401 });
      }

      const userDomain = session.user.email.split("@")[1]?.toLowerCase();
      const allowedList = poll.allowedDomains.toLowerCase().split(",").map((d: string) => d.trim());

      const isAllowed = allowedList.some((domain: string) => {
        const cleanDomain = domain.startsWith("@") ? domain.substring(1) : domain;
        return userDomain === cleanDomain;
      });

      if (!isAllowed) {
        return NextResponse.json({ error: "Your email domain is not authorized to vote on this poll" }, { status: 403 });
      }
    }

    if (poll.requireNames && (!voterName || voterName.trim() === "")) {
      return NextResponse.json({ error: "Your name is required to vote on this poll" }, { status: 400 });
    }

    // IP & User Agent
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const userAgent = req.headers.get("user-agent") ?? "unknown";
    const serverHash = await generateServerFingerprint(ip, userAgent);
    const fingerprintHash = fingerprintClient || serverHash;

    const hasVotedCookie = req.cookies.get(`voted_${pollId}`);

    if (!poll.allowMultipleVotes) {
      if (hasVotedCookie) {
        return NextResponse.json({ error: "You have already voted" }, { status: 403 });
      }

      // Check DB for duplicates
      //
      // TODO (Future): Add a `voteRestriction` field to the Poll schema with two modes:
      //   "DEVICE"  → current behaviour — block by fingerprintHash + ipAddress + userId (1 device = 1 vote)
      //   "ACCOUNT" → block only by userId for signed-in users; fingerprint/IP for anonymous
      //               This lets two different accounts on the same device each cast a vote.
      // Wire the toggle into PollSettingsModal and CreatePollForm when ready.
      //
      const existingVote = await prisma.vote.findFirst({
        where: {
          pollId,
          OR: [
            { fingerprintHash },
            { ipAddress: ip },
            ...(userId ? [{ userId }] : [])
          ]
        }
      });

      if (existingVote) {
        return NextResponse.json({ error: "You have already voted" }, { status: 403 });
      }
    }

    // Record Vote
    await prisma.vote.create({
      data: {
        pollId,
        optionId,
        userId,
        fingerprintHash,
        ipAddress: ip,
        userAgent,
        voterName: voterName ? voterName.trim() : null,
        customAnswer: customAnswer ? customAnswer.trim() : null,
      }
    });

    const res = NextResponse.json({ success: true });

    // Set voted cookie
    res.cookies.set(`voted_${pollId}`, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return res;
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pollId = url.searchParams.get("pollId");

  if (!pollId) {
    return NextResponse.json({ error: "Missing pollId parameter" }, { status: 400 });
  }

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        orderBy: {
          votes: {
            _count: 'desc'
          }
        },
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
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  return NextResponse.json({
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
    allowedDomains: poll.allowedDomains,
    requireAuth: poll.requireAuth,
    expiresAt: poll.expiresAt,
  });
}
