"use client";

import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API;
    const url = `${BACKEND_URL}/auth/login`;

    const fetchPromise = (async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          clave: form.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Las credenciales son incorrectas");
      }

      const data = await response.json();
      return data;
    })();

    toast.promise(fetchPromise, {
      loading: "Iniciando sesión...",
      success: "Sesión iniciada con éxito",
      error: "Las credenciales son incorrectas",
    });

    try {
      const response = await fetchPromise;

      if (!response.data) {
        toast.error("Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);

      window.location.href = "/home";
    } catch (error) {
      toast.error("Error al iniciar sesión");
      console.error(error);
    }
  }

  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="w-full md:w-2/5 flex items-center justify-center px-6 py-8 bg-white">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="text-md text-blue-600 text-left hover:cursor-pointer hover:text-neutral-800"
            >
              Itinetravel
            </Link>
            <h1 className="text-4xl font-bold text-blue-600 mb-6 text-left">
              Iniciar Sesión
            </h1>

            <form onSubmit={handleSubmit} className="w-full space-y-3">
              {[
                {
                  id: "email",
                  label: "Correo Electrónico",
                  type: "email",
                  placeholder: "example@gmail.com",
                },
                {
                  id: "password",
                  label: "Contraseña",
                  type: "password",
                  placeholder: "•••••••",
                },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-sm text-neutral-800 mb-1"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    value={(form as any)[id]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm"
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-yellow-400 transition-all duration-300 ease-in-out font-medium mt-4 text-base hover:cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </form>

            <p className="text-sm text-neutral-800 mt-4 text-center">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-bold hover:border-b-2"
              >
                Registrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Photo */}
        <div className="hidden md:block md:w-3/5">
          <img
            src="/auth-photo.webp"
            alt="Foto de una persona con su maleta"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </>
  );
}
