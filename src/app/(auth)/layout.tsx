import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Logo from "./Logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function AuthLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Logo />
          <div className="w-screen h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col justify-center items-center">
            {children}
          </div>
        </body>
        </html>   
    );
}