import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className= "flex flex-col justify-center items-center px-6 py-10 w-5/6 h-9/12  md:w-4/12 md:h-8/12  bg-white rounded-2xl backdrop-blur-3xl shadow-lg">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">Iniciar Sesión</h1>
                <form className="w-full max-w-sm mb-5">
                    <label htmlFor="email" className="text-xl text-neutral-800">Correo Electrónico</label>
                    <input type="email" id="email" className="w-full px-4 py-2 mb-4 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white/0 transition-all duration-200" placeholder="example@gmail.com" required />
                    <label htmlFor="password" className="text-xl text-neutral-800">Contraseña</label>
                    <input type="password" id="password" className="w-full px-4 py-2 mb-4 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-white/0 transition-all duration-200" placeholder="•••••••" required />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-yellow-400 hover:cursor-pointer transition-all duration-300 ease-in-out">Iniciar Sesión</button>
                </form>
                <p className="text-neutral-800">¿No tienes cuenta? <Link href="/register" className="text-blue-600 font-bold hover:border-b-2">Registrate aquí</Link></p>
            </div>
        </>
    );
}