import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const friendships = await friendShip.findMany({
      where: {
        userId,
      },
      include: {
        fiend: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const friends = friendships.map((friendship) => ({
      id: friendship.friend.id,
      firstName: friendship.friend.firstName,
      lastName: friendship.friend.lastName,
      email: friendship.friend.email,
    }));

    return NextResponse.json({
      friends,
    });
  } catch (error) {
    console.error("GET FRIENDS ERROR : ", error);

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
