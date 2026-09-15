import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { error } from "node:console";
import { selector } from "gsap";
import { resourceUsage } from "node:process";

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

    const body = await request.json();
    const receiverId = Number(body.receiverId);

    if (!Number.isInteger(receiverId) || receiverId <= 0) {
      return NextResponse.json(
        {
          error: "A valid receiverId is required",
        },
        {
          status: 400,
        },
      );
    }

    const senderId = Number(session.user.id);

    if (senderId === receiverId) {
      return NextResponse.json(
        {
          error: "you can't send a friend request to yourself",
        },
        {
          status: 400,
        },
      );
    }

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
      select: {
        id: true,
        emailVerified: true,
      },
    });

    if (!receiver || !receiver.emailVerified) {
      return NextResponse.json(
        {
          error: "user not found",
        },
        {
          status: 404,
        },
      );
    }

    const existingFriendship = await prisma.friendShip.findFirst({
      where: {
        OR: [
          {
            userId: senderId,
            friendId: receiverId,
          },
          {
            userId: receiverId,
            friendId: senderId,
          },
        ],
      },
    });

    if (existingFriendship) {
      return NextResponse.json(
        {
          error: "You are already friends",
        },
        {
          status: 409,
        },
      );
    }

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          {
            senderId,
            receiverId,
            status: "PENDING",
          },
          {
            senderId: receiverId,
            receiverId: senderId,
            status: "PENDING",
          },
        ],
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          error: "A pending friend request already exists",
        },
        {
          status: 409,
        },
      );
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Friend request send successfully",
        request: {
          id: friendRequest.id,
          senderId: friendRequest.senderId,
          receiverId: friendRequest.receiverId,
          status: friendRequest.status,
          createAt: friendRequest.createdAt,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("FRIEND REQUEST ERROR : ", error);

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
