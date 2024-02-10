import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import EmailVerificationBanner from "../components/Auth/EmailVarificationBanner";
import NavBar from "../components/NavBar/NavBar";

interface Props {
  children: ReactNode;
}
const PrivateLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/auth/signin");
  return (
    <div className="max-w-screen-xl mx-auto p-4 xl:p-0">
      <NavBar />
      <EmailVerificationBanner />
      {children}
    </div>
  );
};

export default PrivateLayout;
