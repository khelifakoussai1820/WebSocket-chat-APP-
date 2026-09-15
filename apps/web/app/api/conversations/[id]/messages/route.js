import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getConversationMember(conversationId, userId) {
  return prisma.conversationMember.findFirst({
    where: {
      conversationId,
      userId,
    },
  });
}

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const userId = Number(session.user.id);
    const conversationId = Number((await params).id);

    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid conversation Id",
        },
        {
          status: 400,
        },
      );
    }

    const member = await getConversationMember(conversationId, userId);

    if (!member) {
      return NextResponse.json(
        { error: " You are not a member of this conversation" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);

    const limitParam = Number(searchParams.get("limit") || 50);
    const limit = Math.min(Math.max(limitParam, 1), 100);

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error("GET MESSAGES ERROR : ", error);

    return NextResponse.json(
      {
        error: "Something Went wrong ",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const conversationId = Number((await params).id);

    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      return NextResponse.json(
        { error: "Invalid conversation ID." },
        { status: 400 },
      );
    }

    const member = await getConversationMember(conversationId, userId);

    if (!member) {
      return NextResponse.json(
        { error: "You are not a member of this conversation." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 },
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        content,
      },

      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("SEND MESSAGE ERROR : ", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
