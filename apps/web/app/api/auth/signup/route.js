import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateOTP, getOtpExpiration } from "@/services/otp";
import { sendVerificationEmail } from "@/services/mail";

export async function POST(request) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error: "Password must contain at least 8 characters",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this is email already exists",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const code = generateOTP();
    const expiresAt = getOtpExpiration();

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    await sendVerificationEmail(user.email, code);

    console.log("OTP : ", code);

    return NextResponse.json(
      {
        message: "Account Created Sucessfully",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("SIGNUP ERROR : ", error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
