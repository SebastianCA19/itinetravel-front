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
    const { name, value } = e.target;

    if(name === "phone"){
      // Allow only digits in the phone input
      const numericValue = value.replace(/\D/g, '');
      
      if(numericValue.length <= 9){
        setForm({
          ...form,
          [name]: numericValue,
        });
      }
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.conPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API;
    const url = `${BACKEND_URL}/auth/register`;

    const bodyData : any = {
      nombreUsuario: form.name,
      apellidoUsuario: form.lastName,
      email: form.email,
      telefono: null,
      clave: form.password,
    }

    if(form.phone.trim()){
      bodyData.telefono = parseInt(form.phone.trim());
    }

    const fetchPromise = (async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error("Error al registrar el usuario");
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
      const response = await fetchPromise;
      
      if(!response.data){
        toast.error("Error al registrar el usuario");
        return;
      }
      
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);

      window.location.href = "/home";
    } catch (error) {
      toast.error("Error al registrar el usuario");
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
        <div className="w-full md:w-2/5 flex flex-col items-center justify-center px-6 py-8 bg-white">
          <div className="w-full max-w-md">
            <Link href="/" className="text-md text-blue-600 text-left hover:cursor-pointer hover:text-neutral-800">
              Itinetravel
            </Link>
            <h1 className="text-4xl font-bold text-blue-600 mb-6 text-left">
              Registrarse
            </h1>

            <form onSubmit={handleSubmit} className="w-full space-y-3">
              {[
                { id: "name", label: "Nombre", type: "text", placeholder: "Juan" },
                { id: "lastName", label: "Apellido", type: "text", placeholder: "Pérez" },
                { id: "email", label: "Correo Electrónico", type: "email", placeholder: "example@gmail.com" },
                { id: "password", label: "Contraseña", type: "password", placeholder: "•••••••" },
                { id: "conPassword", label: "Confirmar Contraseña", type: "password", placeholder: "•••••••" },
                { id: "phone", label: "Teléfono (Opcional)", type: "tel", placeholder: "123456789" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm text-neutral-800 mb-1">
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
                    required={id !== "phone"}
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-yellow-400 transition-all duration-300 ease-in-out font-medium mt-4 text-base hover:cursor-pointer"
              >
                Registrarse
              </button>
            </form>

            <p className="text-sm text-neutral-800 mt-4 text-center">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-bold hover:border-b-2"
              >
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Photo*/}
        <div className="hidden md:block md:w-3/5">
          <img src="/auth-photo.webp" alt="Foto de una persona con su maleta" className="w-full h-full object-cover"/>
        </div>
      </div>
    </>
  );
}