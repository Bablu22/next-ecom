"use client";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  searchParams: { token: string; userId: string };
}

const Verfy = (props: Props) => {
  const { token, userId } = props.searchParams;
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const apiRes = await res.json();
      const { error, message } = apiRes as { error: string; message: string };
      if (res.ok) {
        toast.success(message);
        router.replace("/");
      }
      if (!res.ok && error) {
        toast.error(error);
      }
      router.replace("/");
    });
  }, []);

  if (!token || !userId) return notFound();

  return (
    <div className=" animate-pulse flex items-center justify-center w-full text-center h-screen text-3xl ">
      <div>
        <h6>Please wait... </h6>
        <p>We are verifying your email</p>
      </div>
    </div>
  );
};

export default Verfy;
