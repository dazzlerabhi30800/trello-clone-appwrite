import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Modal from "@/components/Modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trello Clone 2.0",
  description: "coded by dazzler abhi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F5F6F8] flex flex-col`}>
        {children}
        <Modal />
      </body>
    </html>
  );
}
