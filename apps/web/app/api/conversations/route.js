import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
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

    const body = await request.json();
    const friendId = Number(body.friendId);

    if (!Number.isInteger(friendId) || friendId <= 0) {
      return NextResponse.json(
        {
          error: "A valid friend is required ",
        },
        {
          status: 400,
        },
      );
    }

    if (userId === friendId) {
      return NextResponse.json(
        {
          error: "You cannot create a conversation with yourself",
        },
        {
          status: 400,
        },
      );
    }

    const friendship = await prisma.friendShip.findFirst({
      where: {
        userId,
        friendId,
      },
    });

    if (!friendship) {
      return NextResponse.json(
        {
          error: "You can only start a conversation with a friend",
        },
        {
          status: 403,
        },
      );
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            members: {
              some: {
                userId,
              },
            },
          },
          {
            members: {
              some: {
                userId: friendId,
              },
            },
          },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json({
        conversation: existingConversation,
      });
    }

    const conversation = await prisma.conversation.create({
      data: {
        members: {
          create: [
            {
              userId,
            },
            {
              userId: friendId,
            },
          ],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        conversation,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("CREATE CONVERSATION ERROR : ", error);

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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const conversations = await prisma.conversation.findMany({
      where: {
        some: {
          userId,
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
          },
        },

        orderBy: {
          updatedAt: "desc",
        },
      },
    });

    return NextResponse.json({
      conversations,
    });
  } catch (error) {
    console.error("GET CONVERSATIONS ERROR : ", error);

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
