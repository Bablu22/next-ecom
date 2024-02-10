import startDB from "@/app/lib/db";
import { sendEmail } from "@/app/lib/email";
import PasswordRestTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModel";
import { UpdatePasswordRequest } from "@/app/types";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req: Request) => {
  try {
    const { password, token, userId } =
      (await req.json()) as UpdatePasswordRequest;

    if (!password || !token || !userId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 401 });
    }

    await startDB();
    const resetToken = await PasswordRestTokenModel.findOne({ user: userId });
    if (!resetToken) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }
    const matched = await resetToken.compareToken(token);
    if (!matched) {
      return NextResponse.json(
        { error: "Unauthorized request" },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Invalid Email" }, { status: 401 });
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (isPasswordMatched) {
      return NextResponse.json(
        { error: "Password must be different" },
        { status: 401 }
      );
    }

    user.password = password;
    await user.save();

    await PasswordRestTokenModel.findByIdAndDelete(resetToken._id);

    sendEmail({
      profile: { name: user.name, email: user.email },
      subject: "password-change",
    });

    return NextResponse.json({ message: "Your password is now changed" });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not update the password" },
      { status: 500 }
    );
  }
};
