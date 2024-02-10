import UpdatePassword from "@/app/components/Auth/UpdatePassword";
import startDB from "@/app/lib/db";
import PasswordRestTokenModel from "@/app/models/passwordResetTokenModel";
import { notFound, useRouter } from "next/navigation";
import React from "react";

interface Props {
  searchParams: { token: string; userId: string };
}

const fetchTokenValidation = async (token: string, userId: string) => {
  await startDB();
  const resetToken = await PasswordRestTokenModel.findOne({ user: userId });
  if (!resetToken) return null;

  const matched = await resetToken.compareToken(token);
  if (!matched) return null;

  return true;
};

const ResetPassword = async (props: Props) => {
  const { token, userId } = props.searchParams;

  const isValid = await fetchTokenValidation(token, userId);
  if (!isValid) return notFound();

  if (!token || !userId) return notFound();
  return <UpdatePassword token={token} userId={userId} />;
};

export default ResetPassword;
