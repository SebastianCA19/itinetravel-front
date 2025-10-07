"use client";
import React, { useState, useEffect } from "react";
import { Plus, MapPin, Calendar, Hotel, Plane, UtensilsCrossed, Camera, Trash2, X, Loader2, Bus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Types based on backend API
interface ActivityItem {
  idActividad?: number;
  idViaje: number;
  idTipoActividad: number;
  idUbicacion?: number;
  titulo: string;
  descripcionActividad: string;
  fecha: string;
  costo: number;
  type: 'activity';
}

interface LodgingItem {
  idAlojamiento?: number;
  idViaje: number;
  idTipoActividad: number;
  titulo: string;
  descripcionActividad: string;
  fecha: string;
  costo: number;
  nombreHotel: string;
  direccion?: string;
  checkIn?: string;
  checkOut?: string;
  contacto?: string;
  type: 'lodging';
}

interface TransportItem {
  idTransporte?: number;
  idViaje: number;
  idTipoActividad: number;
  titulo: string;
  descripcionActividad: string;
  fecha: string;
  costo: number;
  tipoTransporte: string;
  empresa: string;
  origenTransporte: string;
  destinoTransporte: string;
  type: 'transport';
}

interface FlightItem {
  idVuelo?: number;
  idViaje: number;
  idTipoActividad: number;
  titulo: string;
  descripcionActividad: string;
  fecha: string;
  costo: number;
  aereolineaa: string;
  nVuelo: number;
  idOrigenVuelo?: number;
  idDestinoVuelo?: number;
  type: 'flight';
}

type ItineraryItem = ActivityItem | LodgingItem | TransportItem | FlightItem;

interface Itinerary {
  idViaje?: number;
  idViajero: number;
  nombreViaje: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  items: ItineraryItem[];
}

export default function ItinerariesPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8080";
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewItineraryModal, setShowNewItineraryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<number | null>(null);
  const [itemType, setItemType] = useState<'activity' | 'lodging' | 'transport' | 'flight'>('activity');

  // New Itinerary Form
  const [newItinerary, setNewItinerary] = useState({
    nombreViaje: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: ""
  });

  // Form states for different item types
  const [activityForm, setActivityForm] = useState({
    titulo: "",
    descripcionActividad: "",
    fecha: "",
    costo: 0,
    idTipoActividad: 2, // Default for activities
    idUbicacion: undefined as number | undefined
  });

  const [lodgingForm, setLodgingForm] = useState({
    titulo: "",
    descripcionActividad: "",
    fecha: "",
    costo: 0,
    nombreHotel: "",
    direccion: "",
    checkIn: "",
    checkOut: "",
    contacto: "",
    idTipoActividad: 4,
  });

  const [transportForm, setTransportForm] = useState({
    titulo: "",
    descripcionActividad: "",
    fecha: "",
    costo: 0,
    tipoTransporte: "",
    empresa: "",
    origenTransporte: "",
    destinoTransporte: "",
    idTipoActividad: 6, // Transport type
  });

  const [flightForm, setFlightForm] = useState({
    titulo: "",
    descripcionActividad: "",
    fecha: "",
    costo: 0,
    aereolineaa: "",
    nVuelo: 0,
    idOrigenVuelo: undefined as number | undefined,
    idDestinoVuelo: undefined as number | undefined,
    idTipoActividad: 5, // Flight type
  });

  // Fetch all trips and filter by traveler ID
  const fetchItineraries = async () => {
  try {
    setLoading(true);
    const travelerId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!travelerId || !token) {
      console.error("No traveler ID or token found");
      setLoading(false);
      return;
    }

    const response = await fetch(`${BACKEND_URL}/api/viajes/usuarios/${travelerId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Failed to fetch itineraries");
    const userTrips = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedTrips = await Promise.all(
      userTrips.data.map(async (trip: any) => {
        try {
          const activitiesResponse = await fetch(`${BACKEND_URL}/api/actividades/viajes/${trip.idViaje}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          let activities = [];
          if (activitiesResponse.ok) {
            const activitiesData = await activitiesResponse.json(); 
            activities = activitiesData.data.map((item: any) => ({
              ...item,
              type:
                item.idTipoActividad === 2 ? "activity" :
                item.idTipoActividad === 4 ? "lodging" :
                item.idTipoActividad === 6 ? "transport" :
                item.idTipoActividad === 5 ? "flight" :
                "activity"
            }));
          }

          return {
            ...trip,
            items: activities
          };
        } catch (err) {
          console.error(`Error fetching activities for trip ${trip.idViaje}:`, err);
          return {
            ...trip,
            items: []
          };
        }
      })
    );

    setItineraries(transformedTrips);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleCreateItinerary = async () => {
  if (!newItinerary.nombreViaje || !newItinerary.descripcion) return;

  const travelerId = localStorage.getItem("id");
  if (!travelerId) {
    console.error("No traveler ID found in localStorage");
    return;
  }

  const payload = {
    idViajero: parseInt(travelerId),
    nombreViaje: newItinerary.nombreViaje,
    descripcion: newItinerary.descripcion,
    fechaInicio: newItinerary.fechaInicio,
    fechaFin: newItinerary.fechaFin
  };

  await toast.promise(
    (async () => {
      const response = await fetch(`${BACKEND_URL}/api/viajes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          setLoading(true);
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          window.location.href = "/login";
        }
        throw new Error("Error al crear el itinerario");
      }

      await fetchItineraries();
      setNewItinerary({ nombreViaje: "", descripcion: "", fechaInicio: "", fechaFin: "" });
      setShowNewItineraryModal(false);
    })(),
    {
      loading: "Creando itinerario...",
      success: "Itinerario creado con éxito",
      error: "No se pudo crear el itinerario"
    }
  );

  setLoading(false);
};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddItem = async () => {
  if (!selectedItinerary) return;

  try {
    let endpoint = "";
    let payload: any = {};

    switch (itemType) {
      case "activity":
        endpoint = `${BACKEND_URL}/api/actividades`;
        payload = {
          idViaje: selectedItinerary,
          ...activityForm,
          fecha: activityForm.fecha ? `${activityForm.fecha}T10:00:00` : null,
          idUbicacion: activityForm.idUbicacion
            ? Number(activityForm.idUbicacion)
            : null,
        };
        break;

      case "lodging":

        const checkInDate = new Date(lodgingForm.checkIn);
        if (checkInDate < new Date()) {
          toast.error("La fecha de check-in debe ser futura");
          return;
      }

        endpoint = `${BACKEND_URL}/api/actividades/alojamientos`;
        payload = {
          idViaje: selectedItinerary,
          ...lodgingForm,
          fecha: lodgingForm.fecha ? `${lodgingForm.fecha}T12:00:00` : undefined,
          checkIn: lodgingForm.checkIn
            ? `${lodgingForm.checkIn}T12:00:00`
            : undefined,
          checkOut: lodgingForm.checkOut
            ? `${lodgingForm.checkOut}T12:00:00`
            : undefined,
        };
        break;

      case "transport":
        endpoint = `${BACKEND_URL}/api/actividades/transportes`;
        payload = {
          idViaje: selectedItinerary,
          ...transportForm,
          fecha: transportForm.fecha
            ? `${transportForm.fecha}T00:00:00`
            : undefined,
        };
        break;

      case "flight":
        endpoint = `${BACKEND_URL}/api/actividades/vuelos`;
        payload = {
          idViaje: selectedItinerary,
          ...flightForm,
          fecha: flightForm.fecha ? `${flightForm.fecha}T00:00:00` : undefined,
        };
        break;
    }

    console.log("Payload to be sent:", payload);

    await toast.promise(
      (async () => {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok){
          console.log("Response not ok:", response);
          console.log("Response body", await response.text());
          throw new Error("Error al agregar la actividad");
        }  
        return response.json();
      })(),
      {
        loading: "Agregando actividad...",
        success: "Actividad agregada con éxito",
        error: "Error al agregar la actividad",
      }
    );

    // Refrescar la lista
    await fetchItineraries();

    // Resetear formularios
    setActivityForm({
      titulo: "",
      descripcionActividad: "",
      fecha: "",
      costo: 0,
      idTipoActividad: 2,
      idUbicacion: undefined,
    });
    setLodgingForm({
      titulo: "",
      descripcionActividad: "",
      fecha: "",
      costo: 0,
      nombreHotel: "",
      direccion: "",
      checkIn: "",
      checkOut: "",
      contacto: "",
      idTipoActividad: 4,
    });
    setTransportForm({
      titulo: "",
      descripcionActividad: "",
      fecha: "",
      costo: 0,
      tipoTransporte: "",
      empresa: "",
      origenTransporte: "",
      destinoTransporte: "",
      idTipoActividad: 6,
    });
    setFlightForm({
      titulo: "",
      descripcionActividad: "",
      fecha: "",
      costo: 0,
      aereolineaa: "",
      nVuelo: 0,
      idOrigenVuelo: undefined,
      idDestinoVuelo: undefined,
      idTipoActividad: 5,
    });

    setShowItemModal(false);
  } catch (error) {
    console.error("Error adding item:", error);
  }
};


const handleDeleteItinerary = async (id: number) => {
  toast((t) => (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-800">¿Seguro que deseas eliminar este itinerario?</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            toast.loading("Eliminando itinerario...");

            try {
              const response = await fetch(`${BACKEND_URL}/api/viajes/${id}`, {
                headers: {
                  "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
                },
                method: "DELETE",
              });

              if (!response.ok) throw new Error("Failed to delete itinerary");

              await fetchItineraries();
              toast.dismiss(); // elimina el toast de carga
              toast.success("Itinerario eliminado con éxito");
            } catch (error) {
              console.error("Error deleting itinerary:", error);
              toast.dismiss();
              toast.error("Error al eliminar el itinerario");
            }
          }}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  ));
};


  const getItemIcon = (type: string) => {
    switch(type) {
      case 'lodging': return <Hotel className="w-5 h-5" />;
      case 'transport': return <Bus className="w-5 h-5" />;
      case 'flight': return <Plane className="w-5 h-5" />;
      case 'activity': return <Camera className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getItemColor = (type: string) => {
    switch(type) {
      case 'lodging': return 'bg-purple-100 text-purple-600';
      case 'transport':
      case 'flight': return 'bg-blue-100 text-blue-600';
      case 'activity': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
        <div><Toaster /></div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Itinerarios</h1>
            <p className="text-gray-600 mt-1">Organiza tus viajes y aventuras</p>
          </div>
          <button
            onClick={() => setShowNewItineraryModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Nuevo Itinerario
          </button>
        </div>

        {/* Itineraries Grid */}
        {itineraries.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes itinerarios</h3>
            <p className="text-gray-600 mb-6">Comienza creando tu primer viaje</p>
            <button
              onClick={() => setShowNewItineraryModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear mi primer itinerario
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map(itinerary => (
              <div key={itinerary.idViaje} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{itinerary.nombreViaje}</h3>
                    <button
                      onClick={() => itinerary.idViaje && handleDeleteItinerary(itinerary.idViaje)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100 mt-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {itinerary.fechaInicio} - {itinerary.fechaFin}
                    </span>
                  </div>
                  <p className="text-sm text-blue-100 mt-2">{itinerary.descripcion}</p>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    {itinerary.items.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">
                        No hay actividades agregadas
                      </p>
                    ) : (
                      itinerary.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                          <div className={`p-2 rounded-lg ${getItemColor(item.type)}`}>
                            {getItemIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate text-sm">{item.titulo}</p>
                            <p className="text-xs text-gray-500">{item.fecha}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {itinerary.items.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{itinerary.items.length - 3} más
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedItinerary(itinerary.idViaje!);
                      setShowItemModal(true);
                    }}
                    className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    + Agregar actividad
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Itinerary Modal */}
        {showNewItineraryModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Nuevo Itinerario</h2>
                <button onClick={() => setShowNewItineraryModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del viaje</label>
                  <input
                    type="text"
                    value={newItinerary.nombreViaje}
                    onChange={(e) => setNewItinerary({...newItinerary, nombreViaje: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Vacaciones en Europa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={newItinerary.descripcion}
                    onChange={(e) => setNewItinerary({...newItinerary, descripcion: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Viaje familiar por Europa"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha inicio</label>
                    <input
                      type="date"
                      value={newItinerary.fechaInicio}
                      onChange={(e) => setNewItinerary({...newItinerary, fechaInicio: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha fin</label>
                    <input
                      type="date"
                      value={newItinerary.fechaFin}
                      onChange={(e) => setNewItinerary({...newItinerary, fechaFin: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowNewItineraryModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateItinerary}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Crear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showItemModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Agregar Actividad</h2>
                <button onClick={() => setShowItemModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="activity">📸 Actividad</option>
                    <option value="lodging">🏨 Alojamiento</option>
                    <option value="transport">🚗 Transporte</option>
                    <option value="flight">✈️ Vuelo</option>
                  </select>
                </div>

                {/* Activity Form */}
{itemType === 'activity' && (
  <>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Título *
      </label>
      <input
        type="text"
        value={activityForm.titulo}
        onChange={(e) =>
          setActivityForm({ ...activityForm, titulo: e.target.value })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Ej: Visita al museo"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Descripción
      </label>
      <textarea
        value={activityForm.descripcionActividad}
        onChange={(e) =>
          setActivityForm({
            ...activityForm,
            descripcionActividad: e.target.value,
          })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fecha *
        </label>
        <input
          type="date"
          value={activityForm.fecha}
          onChange={(e) =>
            setActivityForm({ ...activityForm, fecha: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Costo *
        </label>
        <input
          type="number"
          value={activityForm.costo}
          onChange={(e) =>
            setActivityForm({
              ...activityForm,
              costo: parseFloat(e.target.value),
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: 25.50"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Ubicación *
      </label>
      <select
        value={activityForm.idUbicacion || ""}
        onChange={(e) =>
          setActivityForm({
            ...activityForm,
            idUbicacion: parseInt(e.target.value),
          })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Selecciona ubicación</option>
        <option value="1">Museo Nacional</option>
        <option value="2">Parque Tayrona</option>
        <option value="3">Centro Histórico</option>
      </select>
    </div>
  </>
)}


                {/* Flight Form */}
                {itemType === 'flight' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                      <input
                        type="text"
                        value={flightForm.titulo}
                        onChange={(e) => setFlightForm({...flightForm, titulo: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Vuelo a París"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <textarea
                        value={flightForm.descripcionActividad}
                        onChange={(e) => setFlightForm({...flightForm, descripcionActividad: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Aerolínea *</label>
                        <input
                          type="text"
                          value={flightForm.aereolineaa}
                          onChange={(e) => setFlightForm({...flightForm, aereolineaa: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: Avianca"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Vuelo *</label>
                        <input
                          type="number"
                          value={flightForm.nVuelo}
                          onChange={(e) => setFlightForm({...flightForm, nVuelo: parseInt(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ej: 1234"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                        <input
                          type="date"
                          value={flightForm.fecha}
                          onChange={(e) => setFlightForm({...flightForm, fecha: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Costo *</label>
                        <input
                          type="number"
                          value={flightForm.costo}
                          onChange={(e) => setFlightForm({...flightForm, costo: parseFloat(e.target.value)})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Lodging Form */}
                {itemType === 'lodging' && (
                  <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                        <input
                          type="text"
                          value={lodgingForm.titulo}
                            onChange={(e) => setLodgingForm({...lodgingForm, titulo: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Hotel en Roma"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                        <textarea
                          value={lodgingForm.descripcionActividad}
                          onChange={(e) => setLodgingForm({...lodgingForm, descripcionActividad: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Hotel *</label>
                        <input
                            type="text"
                            value={lodgingForm.nombreHotel}
                            onChange={(e) => setLodgingForm({...lodgingForm, nombreHotel: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Hotel Roma"
                        />
                      </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                        <input
                            type="text"
                            value={lodgingForm.direccion}
                            onChange={(e) => setLodgingForm({...lodgingForm, direccion: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Calle 123, Ciudad"
                        ></input>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-In</label>
                        <input
                            type="date"
                            value={lodgingForm.checkIn}
                            onChange={(e) => setLodgingForm({...lodgingForm, checkIn: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </input>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check-Out</label>
                        <input
                            type="date"
                            value={lodgingForm.checkOut}
                            onChange={(e) => setLodgingForm({...lodgingForm, checkOut: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </input>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contacto</label>
                        <input
                            type="text"
                            value={lodgingForm.contacto}
                            onChange={(e) => setLodgingForm({...lodgingForm, contacto: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: +123456789"
                        ></input>
                    </div>
                    <div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                        <input
                            type="date" 
                            value={lodgingForm.fecha}
                            onChange={(e) => setLodgingForm({...lodgingForm, fecha: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></input>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Costo *</label>
                        <input
                            type="number"
                            value={lodgingForm.costo}
                            onChange={(e) => setLodgingForm({...lodgingForm, costo: parseFloat(e.target.value)})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: 150.00"
                        />
                    </div>
                  </>
                )}
                {/* Transport Form */}
                {itemType === 'transport' && (
                  <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                        <input
                            type="text"
                            value={transportForm.titulo}
                            onChange={(e) => setTransportForm({...transportForm, titulo: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Viaje en bus"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                        <textarea
                            value={transportForm.descripcionActividad}
                            onChange={(e) => setTransportForm({...transportForm, descripcionActividad: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Transporte *</label>
                        <input
                            type="text"
                            value={transportForm.tipoTransporte}
                            onChange={(e) => setTransportForm({...transportForm, tipoTransporte: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Taxi, Bus"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Empresa *</label>
                        <input
                            type="text"
                            value={transportForm.empresa}
                            onChange={(e) => setTransportForm({...transportForm, empresa: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Uber"
                        />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Origen *</label>
                        <input
                            type="text"
                            value={transportForm.origenTransporte}
                            onChange={(e) => setTransportForm({...transportForm, origenTransporte: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Destino *</label>
                        <input
                            type="text"
                            value={transportForm.destinoTransporte}
                            onChange={(e) => setTransportForm({...transportForm, destinoTransporte: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                        <input
                            type="date"
                            value={transportForm.fecha}
                            onChange={(e) => setTransportForm({...transportForm, fecha: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Costo *</label>
                        <input
                            type="number"
                            value={transportForm.costo}
                            onChange={(e) => setTransportForm({...transportForm, costo: parseFloat(e.target.value)})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        </div>
                    </div>
                  </>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowItemModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}