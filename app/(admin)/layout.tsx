import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminSidebar from "../components/Admin/AdminSidebar";

interface Props {
  children: ReactNode;
}
const AdminLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  if (!isAdmin) return redirect("/auth/signin");
  return (
    <div className="">
      <AdminSidebar>{children}</AdminSidebar>
    </div>
  );
};

export default AdminLayout;
