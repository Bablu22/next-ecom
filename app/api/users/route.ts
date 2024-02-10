import startDB from "@/app/lib/db";
import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { NewUserRequest } from "@/app/types";
import { NextResponse, userAgent } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDB();
  const newUser = await UserModel.create({
    ...body,
  });

  const token = crypto.randomBytes(60).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token: token,
  });

  const resetLink = `${process.env.NEXTAUTH_URL}/verify?token=${token}&userId=${newUser._id}`;

  await sendEmail({
    profile: { name: newUser.name, email: newUser.email },
    linkUr: resetLink,
    subject: "verification",
  });

  return NextResponse.json({ message: "Please check your email" });
};
