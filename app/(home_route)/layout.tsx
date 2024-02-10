import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import EmailVerificationBanner from "../components/Auth/EmailVarificationBanner";
import NavBar from "../components/NavBar/NavBar";

interface Props {
  children: ReactNode;
}
const HomeLayout = async ({ children }: Props) => {
  return (
    <div className="max-w-screen-xl mx-auto p-4 xl:p-0">
      <NavBar />
      {children}
    </div>
  );
};

export default HomeLayout;
