import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itinetravel",
  description: "Una app para planificar tus viajes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <header className= "sticky top-0 z-50 bg-white shadow-md py-3 px-8 md:px-15 flex flex-row justify-between items-center text-blue-500">
           <a href="#hero" className="flex items-center gap-3">
            <Image
            src="/itinetravel-logo.png"
            alt="Itinetravel Logo"
            width={70}
            height={70}
            />
            <h1 className="text-xl md:text-3xl font-extrabold tracking-wide hidden md:block">Itinietravel</h1>
            </a>
          <nav className="text-sm md:text-xl flex flex-row items-center gap-3 md:gap-6">
            <Link href="/login" className="hover:underline">Iniciar Sesión</Link>
            <Link href="/register" className="bg-blue-500 px-5 py-2 rounded-xl text-white hover:bg-yellow-400 transition-all duration-300 ease-in-out">Registrarse</Link>
          </nav>
      </header>
        <div className="w-full min-h-screen flex flex-col">
          {children}
        </div>
      <footer className="text-center text-sm p-6 mt-10 w-full text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} Itinetravel. Todos los derechos reservados.
        </p>
        <p>
          ZapaticosCorp
        </p>
      </footer>
      </body>
    </html>
  );
}
