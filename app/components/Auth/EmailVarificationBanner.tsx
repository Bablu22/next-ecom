"use client";

import useAuth from "@/app/hooks/useAuth";
import React, { useState } from "react";
import { toast } from "react-toastify";

const EmailVerificationBanner = () => {
  const { profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleResendVerification = async () => {
    if (!profile) return;
    setSubmitting(true);
    const res = await fetch("/api/users/verify?userId=" + profile?.id, {
      method: "GET",
    });
    const { message, error } = await res.json();
    if (!res.ok && error) {
      toast.error(error);
    }

    toast.success(message);
    setSubmitting(false);
  };

  if (profile?.varified) return null;
  return (
    <div
      className="bg-gray-100 border-l-4 border-gray-800 p-4 mt-5"
      role="alert"
    >
      <p className="font-bold">Email Verification Required:</p>
      <p>
        It looks like you haven't verified your email address yet. Please check
        your inbox and follow the instructions to verify your email.
      </p>
      <button
        onClick={handleResendVerification}
        disabled={submitting}
        className="mt-2 bg-gray-900 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded transition duration-300 ease-out delay-150"
      >
        {submitting ? "Generating link" : "Resend Verification Link"}
      </button>
    </div>
  );
};

export default EmailVerificationBanner;
