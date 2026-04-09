import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "norri3.com",
  description: "Welcome to norri3.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
