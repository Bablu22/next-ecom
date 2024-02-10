import PasswordRestTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModel";
import { ForgetPasswordRequest } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDB from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPasswordRequest;
    if (!email) {
      return NextResponse.json({ error: "Invalid email" }, { status: 401 });
    }
    startDB();
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await PasswordRestTokenModel.findOneAndDelete({ user: user._id });
    const token = crypto.randomBytes(60).toString("hex");
    await PasswordRestTokenModel.create({
      user: user._id,
      token,
    });

    const resetPassLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&userId=${user._id}`;

    await sendEmail({
      profile: { name: user.name, email: user.email },
      linkUr: resetPassLink,
      subject: "verification",
    });

    return NextResponse.json({ message: "Please check your email" });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};
