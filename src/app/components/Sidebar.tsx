"use client";
import React from "react";
import "../globals.css";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const container = document.getElementById("sidebar-container");
    if (container && !container.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const handleClickOnLink = (event: Event): void => {
    const links = document.querySelectorAll("nav a");
    links.forEach((link) =>
      link.classList.remove("text-blue-600", "border-l-blue-600", "bg-blue-50")
    );
    const target = event.currentTarget as HTMLAnchorElement;
    target.classList.add("text-blue-600", "border-l-blue-600", "bg-blue-50");
  };

  React.useEffect(() => {
    const links = document.querySelectorAll("nav a");
    links.forEach((link) => {
      link.addEventListener("click", handleClickOnLink);
    });
    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleClickOnLink);
      });
    };
  }, []);

   const [userInfo, setUserInfo] = React.useState<{
  nombreUsuario: string;
  apellidoUsuario: string;
  email: string;
} | null>(null);

React.useEffect(() => {
  async function getUserInfo() {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;
    
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    // Check if required data exists
    if (!id || !token) {
      console.error("Missing id or token in localStorage");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/viajeros/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User data fetched:", data); // Debug log
      setUserInfo(data); 
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  }

  getUserInfo();
}, []);


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-10 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div id="sidebar-container">
        <button
          className="md:hidden fixed p-3 text-white top-4 right-4 z-30 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <aside
          id="sidebar"
          className={`fixed md:static top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-50 to-white shadow-xl transition-transform duration-300 z-20 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-gray-200`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white backdrop-blur-sm p-2 rounded-full">
                  <Image
                    src="/itinetravel-logo.png"
                    alt="Itinetravel Logo"
                    width={32}
                    height={32}
                    className="drop-shadow-lg"
                  />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Itinietravel
                </h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-2">
              <div className="space-y-2">
                <Link
                  href="/home/itineraries"
                  className="group border-l-4 border-l-gray-700 flex flex-row items-center gap-4 text-gray-700 hover:border-l-blue-600 hover:text-blue-600 hover:bg-blue-50 pl-4 pr-4 py-3.5 rounded-r-lg transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="fill-current w-6 h-6">
                      <path d="M197.8 100.3C208.7 107.9 211.3 122.9 203.7 133.7L147.7 213.7C143.6 219.5 137.2 223.2 130.1 223.8C123 224.4 116 222 111 217L71 177C61.7 167.6 61.7 152.4 71 143C80.3 133.6 95.6 133.7 105 143L124.8 162.8L164.4 106.2C172 95.3 187 92.7 197.8 100.3zM197.8 260.3C208.7 267.9 211.3 282.9 203.7 293.7L147.7 373.7C143.6 379.5 137.2 383.2 130.1 383.8C123 384.4 116 382 111 377L71 337C61.6 327.6 61.6 312.4 71 303.1C80.4 293.8 95.6 293.7 104.9 303.1L124.7 322.9L164.3 266.3C171.9 255.4 186.9 252.8 197.7 260.4zM288 160C288 142.3 302.3 128 320 128L544 128C561.7 128 576 142.3 576 160C576 177.7 561.7 192 544 192L320 192C302.3 192 288 177.7 288 160zM288 320C288 302.3 302.3 288 320 288L544 288C561.7 288 576 302.3 576 320C576 337.7 561.7 352 544 352L320 352C302.3 352 288 337.7 288 320zM224 480C224 462.3 238.3 448 256 448L544 448C561.7 448 576 462.3 576 480C576 497.7 561.7 512 544 512L256 512C238.3 512 224 497.7 224 480zM128 440C150.1 440 168 457.9 168 480C168 502.1 150.1 520 128 520C105.9 520 88 502.1 88 480C88 457.9 105.9 440 128 440z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-base">Mis Itinerarios</span>
                </Link>

              </div>
            </nav>

            {/* Profile Section */}
<div className="px-4 py-4 border-t border-gray-200">
  <Link
    href="/profile"
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
  >
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
      <span className="text-sm">
        {userInfo ? `${userInfo.nombreUsuario[0]}${userInfo.apellidoUsuario[0]}` : 'JD'}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">
        {userInfo ? `${userInfo.nombreUsuario} ${userInfo.apellidoUsuario}` : 'John Doe'}
      </p>
      <p className="text-xs text-gray-500 truncate">
        {userInfo?.email || 'john@example.com'}
      </p>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  </Link>
</div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                © 2025 Itinietravel
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}