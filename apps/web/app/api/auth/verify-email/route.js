import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();

    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        {
          error: "Email and verification code are required.",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        emailVerification: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        { status: 404 },
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          error: "Email is already verified.",
        },
        { status: 400 },
      );
    }

    const verification = user.emailVerification;

    if (!verification) {
      return NextResponse.json(
        {
          error: "Verification code not found.",
        },
        { status: 404 },
      );
    }

    if (verification.expiresAt < new Date()) {
      await prisma.emailVerification.delete({
        where: {
          id: verification.id,
        },
      });

      return NextResponse.json(
        {
          error: "Verification code has expired.",
        },
        { status: 400 },
      );
    }

    if (verification.code !== code) {
      return NextResponse.json(
        {
          error: "Invalid verification code.",
        },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    });

    await prisma.emailVerification.delete({
      where: {
        id: verification.id,
      },
    });

    return NextResponse.json(
      {
        message: "Email verified successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("EMAIL VERIFICATION ERROR:", error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
