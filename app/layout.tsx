import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const cascadia = localFont({
  src: [
    { path: "../public/fonts/CascadiaCode.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/CascadiaCodeItalic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-cascadia",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plan Metric | Precision Endurance",
  description:
    "Personalised endurance training plans for triathletes, runners, and cyclists. Built on data. Reviewed by humans.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cascadia.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
