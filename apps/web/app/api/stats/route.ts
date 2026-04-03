import { prisma } from "@repo/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [pollCount, voteCount, userCount] = await Promise.all([
      prisma.poll.count(),
      prisma.vote.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json({ polls: pollCount, votes: voteCount, users: userCount });
  } catch {
    return NextResponse.json({ polls: 0, votes: 0, users: 0 });
  }
}
