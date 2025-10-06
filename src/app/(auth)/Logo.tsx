"use client";

export default function Logo() {
  function handleLogoClick() {
    window.location.href = "/main";
  }

  return (
    <div
      id="logo"
      onClick={handleLogoClick}
      className="absolute top-0 left-10 flex items-center gap-3 px-5 py-2 bg-white/50 rounded-b-2xl hover:cursor-pointer"
    >
      <img src="/itinetravel-logo.png" alt="Itinetravel Logo" className="w-15 h-15" />
      <h1 className="text-3xl font-extrabold tracking-wide text-blue-600">Itinetravel</h1>
    </div>
  );
}
