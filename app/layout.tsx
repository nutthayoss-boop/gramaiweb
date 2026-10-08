import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Vision Application",
  description: "ตรวจจับและนับยานพาหนะจากรูปภาพด้วย YOLO",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${prompt.variable} h-full antialiased`}>
      <body className="rd-body min-h-full flex flex-col">{children}</body>
    </html>
  );
}