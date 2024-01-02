import { Inter } from "next/font/google";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    template: "%s - Nextwit",
    default: "Nextwit",
  },
  description: "Yet another social media",
};

import "@/app/globals.css";
import NextAuthProvider from "./provider";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " h-screen"}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
