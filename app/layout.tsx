import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Notification from "./components/Notification/Notification";
import AuthSession from "./components/Auth/AuthSession";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthSession>
      <html lang="en">
        <body className={inter.className}>
          <Notification />
          <NextTopLoader showSpinner={false} />
          {children}
        </body>
      </html>
    </AuthSession>
  );
}
