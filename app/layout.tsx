import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NotificationProvider from "./components/NotificationProvider";
import ThemeProvider from "./components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ft_transcendence | Multiplayer Game Platform",
  description:
    "A real-time multiplayer game platform with chat, tournaments, leaderboards, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} data-theme="dark" suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
