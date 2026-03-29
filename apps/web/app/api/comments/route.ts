import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function POST(req: NextRequest) {
  try {
    const { pollId, text, authorName } = await req.json();

    if (!pollId || !text || text.trim() === "") {
      return NextResponse.json({ error: "Missing pollId or text" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        pollId,
        text: text.trim(),
        authorName: authorName ? authorName.trim() : null,
      }
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pollId = url.searchParams.get("pollId");

  if (!pollId) {
    return NextResponse.json({ error: "Missing pollId" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { pollId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
