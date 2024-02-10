import startDB from "@/app/lib/db";
import UserModel from "@/app/models/userModel";
import { SignInCredentials } from "@/app/types";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password } = (await req.json()) as SignInCredentials;
  if (!email || !password) {
    return NextResponse.json({
      error: "Invalid request, email and password missing",
    });
  }
  await startDB();
  const user = await UserModel.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" });
  }

  const passwordMathed = await user.comparePassword(password);
  if (!passwordMathed) {
    return NextResponse.json({ error: "Invalid credentials" });
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar?.url,
      role: user.role,
      varified: user.verified,
    },
  });
};
