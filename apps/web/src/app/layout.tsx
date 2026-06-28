import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

const interSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfitDisplay = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Al-Munawwaroh — Administrasi TPQ & RTQ Modern",
  description: "Platform SaaS administrasi, tabungan santri, syahriah, dan sistem penggajian pengajar TPQ/RTQ terbaik di Indonesia.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${interSans.variable} ${outfitDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/30 text-slate-900">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
