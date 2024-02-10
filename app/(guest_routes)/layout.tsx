import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import NavBar from "../components/NavBar/NavBar";

interface Props {
  children: ReactNode;
}
const GuestLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  if (session) return redirect("/");
  return (
    <div className="max-w-screen-xl mx-auto p-4 xl:p-0">
      <NavBar />
      {children}
    </div>
  );
};

export default GuestLayout;
