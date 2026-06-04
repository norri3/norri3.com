import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "norri3.com — Rust Force Wipe Countdown",
  description:
    "Live countdown to the next Rust force wipe, upcoming wipe dates, and one-tap calendar reminders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased font-body">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
