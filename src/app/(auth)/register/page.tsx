"use client";

import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
    const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    conPassword: "",
    phone: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.conPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API; // ⚠️ usa NEXT_PUBLIC_
    const url = `${BACKEND_URL}/auth/register`;

    const fetchPromise = (async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombreUsuario: form.name,
          apellidoUsuario: form.lastName,
          email: form.email,
          telefono: form.phone,
          clave: form.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el usuario");
      }

      const data = await response.json();
      return data;
    })();

    toast.promise(fetchPromise, {
      loading: "Creando cuenta...",
      success: "Cuenta creada con éxito",
      error: "Error al crear la cuenta",
    });

    try {
      const data = await fetchPromise;
      console.log("Usuario creado:", data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <div className="flex flex-col items-center px-4 sm:px-6 py-4 sm:py-6 w-11/12 max-w-md mx-auto bg-white rounded-2xl backdrop-blur-3xl shadow-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-2 [&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-thumb]:hover:bg-blue-600">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-3 sm:mb-4">
          Registrarse
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-2.5 sm:space-y-3">
          {[
            { id: "name", label: "Nombre", type: "text", placeholder: "Juan" },
            { id: "lastName", label: "Apellido", type: "text", placeholder: "Pérez" },
            { id: "email", label: "Correo Electrónico", type: "email", placeholder: "example@gmail.com" },
            { id: "password", label: "Contraseña", type: "password", placeholder: "•••••••" },
            { id: "conPassword", label: "Confirmar Contraseña", type: "password", placeholder: "•••••••" },
            { id: "phone", label: "Teléfono (Opcional)", type: "tel", placeholder: "123456789" },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm sm:text-base text-neutral-800 mb-1">
                {label}
              </label>
              <input
                id={id}
                name={id}
                type={type}
                value={(form as any)[id]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-3 py-1.5 sm:py-2 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                required={id !== "phone"}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 sm:py-2.5 rounded-lg hover:bg-yellow-400 transition-all duration-300 ease-in-out font-medium mt-3 sm:mt-4 text-sm sm:text-base"
          >
            Registrarse
          </button>
        </form>


        <p className="text-xs sm:text-sm text-neutral-800 mt-3 sm:mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-bold hover:border-b-2"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </>
  );
}
