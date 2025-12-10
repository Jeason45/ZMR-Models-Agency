import type { Metadata } from "next";
import "./globals.css";
import { MemberAuthProvider } from "@/hooks/useMemberAuth";

export const metadata: Metadata = {
  title: "ZMR Models Agency",
  description: "International modeling agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MemberAuthProvider>
          {children}
        </MemberAuthProvider>
      </body>
    </html>
  );
}
