import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  try {
    const session = getServerSession(authOptions);

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
    const requestId = Number(params.id);

    if (!Number.isInteger(requestId) || requestId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid friend request ID",
        },
        {
          status: 400,
        },
      );
    }

    const friendRequest = await prisma.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!friendRequest) {
      return NextResponse.json(
        {
          error: "Friend request not found ",
        },
        {
          status: 404,
        },
      );
    }

    if (friendRequest.receiverId !== userId) {
      return NextResponse.json(
        {
          error: "You cannot reject this friend request ",
        },
        {
          status: 403,
        },
      );
    }

    if (friendRequest.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "This friend request is not longer pending",
        },
        {
          status: 409,
        },
      );
    }

    const updatedRequest = await prisma.friendRequest.update({
      where: {
        id: friendRequest.id,
      },
      data: {
        status: "REJECTED",
      },
    });

    return NextResponse.json(
      {
        message: "Friend Request rejected",
        updatedRequest,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("REJECT FRIEND REQUEST ERROR : ", error);

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
