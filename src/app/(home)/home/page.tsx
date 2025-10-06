export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-b from-white to-gray-50">
      {/* Encabezado principal */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-800">
            Bienvenido a{" "}
            <span className="text-blue-600 drop-shadow-sm">Itinietravel</span>
          </h1>
          <img
            src="/waving-hand.png"
            alt="Mano saludando"
            className="w-10 h-10 md:w-12 md:h-12 animate-wave"
          />
        </div>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
          Tu plataforma de itinerarios favorita, donde planificar tus viajes es
          más fácil que nunca.
        </p>

        <div className="mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:cursor-pointer"
          >
            Explorar Itinerarios
          </button>
        </div>
      </div>
    </section>
  );
}
