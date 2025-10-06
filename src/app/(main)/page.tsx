export default function Home() {
  return (
    <>
      <div id="hero" className="relative h-[550px] w-full">
        <img
          src="/hero-photo.jpg"
          alt="Imagen Principal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/0"></div>
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-left p-8 md:p-16 w-full max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Planifica tu próximo viaje con Itinetravel
          </h1>
          <p className="text-lg md:text-2xl text-white mb-8 drop-shadow-lg">
            Crea itinerarios personalizados y descubre nuevas aventuras
          </p>
          <a
            href="#"
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-amber-500 transition-all duration-300 ease-in-out drop-shadow-lg"
          >
            Comienza Ahora
          </a>
        </div>
      </div>
      <section id="info" className="px-10 md:px-20 bg-white w-full py-10">
        <div className="flex flex-row justify-between">
          <div className="w-full md:w-2/3">
            <h1 className="text-blue-600 text-4xl font-semibold">¿Que es Itinetravel?</h1>
            <p className="mt-4 max-w-3xl text-neutral-800 text-lg">
            Itinetravel es una aplicación diseñada para ayudarte a planificar y organizar tus viajes de manera eficiente. Con nuestra plataforma, puedes crear itinerarios personalizados, descubrir destinos emocionantes y gestionar todos los aspectos de tu viaje en un solo lugar.
            </p>
            <p className="mt-4 max-w-3xl text-neutral-800 text-lg">
            Ya sea que estés planeando unas vacaciones, un viaje de negocios o una escapada de fin de semana, Itinetravel te proporciona las herramientas necesarias para hacer que tu experiencia de viaje sea inolvidable. <b>¡Empieza a planificar tu próxima aventura con Itinetravel hoy mismo!</b> 
            </p>
          </div>
          <div className="hidden md:flex md:justify-center md:items-center md:flex-row md:w-1/3 md:h-full">
            <img src="/paris.jpg" alt="Imagen de Paris" className="w-[400px] h-[300px] rounded-xl"/>
          </div>
        </div>
      </section>
      <section id="usersNumber" className="px-20 bg-white w-full py-20 text-center">
        <h1 className="text-5xl font-semibold text-blue-600 mb-2">
          <b>+10.000</b> USUARIOS
        </h1>
        <p className="text-lg text-neutral-800">
          Confían en Itinetravel para planificar sus viajes
        </p>
      </section>
      <section id="features" className="px-20 w-full py-10 flex flex-col gap-10 text-center justify-center items-center">
        <h1 className="text-neutral-800 text-2xl font-semibold">Con Itinetravel disfrutas de:</h1>
        <div id="features-cards" className="flex flex-col md:flex-row gap-10 justify-center items-center">
          <div id="feature-card" className="w-fit md:w-[300px] px-5 py-15 rounded-2xl text-center text-yellow-500 flex flex-col justify-center items-center gap-3 border-2 border-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="fill-current w-[60px] h-[60px]"><path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z"/></svg>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Itinerarios Personalizados</h2>
            <p className="text-neutral-800 max-w-sm">Crea y ajusta tus itinerarios de viaje según tus preferencias y necesidades.</p>
          </div>
          <div id="feature-card" className="w-fit md:w-[300px] px-5 py-15 rounded-2xl text-center text-yellow-500 flex flex-col justify-center items-center gap-3 border-2 border-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="fill-current w-[60px] h-[60px]"><path d="M415.9 344L225 344C227.9 408.5 242.2 467.9 262.5 511.4C273.9 535.9 286.2 553.2 297.6 563.8C308.8 574.3 316.5 576 320.5 576C324.5 576 332.2 574.3 343.4 563.8C354.8 553.2 367.1 535.8 378.5 511.4C398.8 467.9 413.1 408.5 416 344zM224.9 296L415.8 296C413 231.5 398.7 172.1 378.4 128.6C367 104.2 354.7 86.8 343.3 76.2C332.1 65.7 324.4 64 320.4 64C316.4 64 308.7 65.7 297.5 76.2C286.1 86.8 273.8 104.2 262.4 128.6C242.1 172.1 227.8 231.5 224.9 296zM176.9 296C180.4 210.4 202.5 130.9 234.8 78.7C142.7 111.3 74.9 195.2 65.5 296L176.9 296zM65.5 344C74.9 444.8 142.7 528.7 234.8 561.3C202.5 509.1 180.4 429.6 176.9 344L65.5 344zM463.9 344C460.4 429.6 438.3 509.1 406 561.3C498.1 528.6 565.9 444.8 575.3 344L463.9 344zM575.3 296C565.9 195.2 498.1 111.3 406 78.7C438.3 130.9 460.4 210.4 463.9 296L575.3 296z"/></svg>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              Acceso desde cualquier lugar
            </h2>
            <p className="text-neutral-800 max-w-sm">
              Accede a tus itinerarios y planes de viaje desde cualquier dispositivo, en cualquier momento y lugar.
            </p>
          </div>
        </div>
      </section>
      <section id="callToAction" className="px-20 py-10 text-center">
        <h1 className="font-bold text-blue-600 mb-8 text-3xl">
          ¿Que esperas para ser parte de nuestra familia?
        </h1>
        <a href="" className="text-xl text-white bg-blue-600 px-4 py-2 rounded-2xl hover:bg-amber-500 transition-all duration-300 ease-in-out">
          ¡Únete a nostros!
        </a>
      </section>
    </>
  );
}
