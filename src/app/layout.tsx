import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Clawdo — Minimalist To-Do & Productivity",
  description: "Aesthetic Zen light mode to-do list with Apple frosted glass, NLP Quick Capture, and Supabase integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-slate-800 bg-[#f4f8f8] selection:bg-teal-500/20 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}
