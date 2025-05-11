import React, { useState } from "react";
import AnimatedSection from "../../../utils/AnimatedSection";
import { FiPlusCircle, FiSearch, FiX } from "react-icons/fi";
import { addDocumentFirebase } from "../../../services/data-firebase";
import { useProducts } from "../../../context/ContextProduct";
import { base } from "framer-motion/client";
import AddPerfume from "./AddPerfume";

export default function InventarioUi({
  addToOrder,
  searchTerm,
  setSearchTerm,
  filteredPerfumes,
}) {
  const [showNewPerfumeForm, setShowNewPerfumeForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

      const { setIsSend, isSend } = useProducts();
  
    const [perfumeSelectd, setPerfumeSelectd] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [newPerfume, setNewPerfume] = useState({
    name: "",
    brand: "",
    origin: "",
    description: "",
    notes: "",
    base: "",
    corazon: "",
    price: "",
    quantity: "",
    duration: "",
    image: [], // ahora es un array para múltiples URLs
    genero: '',
    details: '', // nuevo campo para detalles
  });

  const handleNewPerfumeChange = (e) => {
    const { name, value } = e.target;
    setNewPerfume({ ...newPerfume, [name]: value });
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() !== "") {
      setNewPerfume({
        ...newPerfume,
        image: [...newPerfume.image, newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImageUrl = (index) => {
    const updatedImages = newPerfume.image.filter((_, idx) => idx !== index);
    setNewPerfume({ ...newPerfume, image: updatedImages });
  };

  const handleSubmitNewPerfume = (e) => {
    e.preventDefault();
    // Aquí implementar la lógica para agregar el nuevo perfume.
   // console.log("Nuevo perfume:", newPerfume);
    try {
      addDocumentFirebase("perfumes", newPerfume) 
      setIsSend(!isSend);
    } catch (error) {
      console.error("Error al agregar el nuevo perfume:", error);
      
    }
    // Reiniciar el formulario y ocultarlo.
    setNewPerfume({
      name: "",
      brand: "",
      origin: "",
      description: "",
      notes: "",
      base: "",
    corazon: "",
      price: "",
      quantity: "",
      image: [],
      genero: '',
      details: '',
    });
    setNewImageUrl("");
    setShowNewPerfumeForm(false);
  };
  if(perfumeSelectd) console.log(perfumeSelectd,'perfume selccionado');
  

  return (
    <div className="relative">
      <AnimatedSection delay={0.1}>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Perfumes Disponibles
            </h2>
            <button
              onClick={() => setShowNewPerfumeForm(true)}
              className="mt-3 cursor-pointer bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <FiPlusCircle className="mr-2" /> Añadir Nuevo Perfume
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar perfumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredPerfumes?.map((perfume) => (
            <div
              key={perfume.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              onClick={() => setPerfumeSelectd(perfume)}
            >
              <img
                src={perfume.image[0] || ""}
                alt={perfume.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800">
                    {perfume.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {perfume.brand}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{perfume.origin}</p>
                <p className="text-gray-700 mt-2 text-sm">
                  {perfume.description}
                </p>
                
                <div className="mt-3">
                  <p className="text-sm">
                    <span className="font-medium">Notas:</span> {perfume.notes}
                  </p>
                </div>
               
                <div className="mt-3">
                  <p className="text-sm">
                    <span className="font-medium">Corazón:</span> {perfume.corazon ||"Corazón no disponible"} 
                  </p>
                </div>
                <div className="mt-3">
                  <p className="text-sm">
                    <span className="font-medium">Base:</span> {perfume.base||"Base no disponible"}
                  </p>
                </div>
               
               
                <div className="mt-3">
                  <p className="text-sm">
                    <span className="font-medium">Cantidad:</span> {perfume.quantity}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-gray-900">
                    ${perfume.price}
                    </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      perfume.quantity > 5
                        ? "bg-green-100 text-green-800"
                        : perfume.quantity > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {perfume.quantity > 5
                      ? "Disponible"
                      : perfume.quantity > 0
                      ? "Bajo stock"
                      : "Agotado"}
                  </span>
                </div>
                <button
                  onClick={() => addToOrder(perfume)}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  <FiPlusCircle className="mr-2" /> Agregar a pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

   {/* Modal para nuevo perfume */}
{showNewPerfumeForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2929292a] bg-opacity-50 backdrop-blur-sm p-4">
      <AnimatedSection delay={0.1}>
        <AddPerfume
          newPerfume={newPerfume}
          setNewPerfume={setNewPerfume}
          newImageUrl={newImageUrl}
          setNewImageUrl={setNewImageUrl}
          handleAddImageUrl={handleAddImageUrl}
          handleRemoveImageUrl={handleRemoveImageUrl}
          handleSubmitNewPerfume={handleSubmitNewPerfume}
          onCancel={() => setShowNewPerfumeForm(false)}
        />
      </AnimatedSection>
  </div>
)}

{perfumeSelectd && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2929292a] bg-opacity-50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{perfumeSelectd.name}</h3>
          <p className="text-lg text-gray-600">{perfumeSelectd.brand}</p>
        </div>
        <button
          onClick={() => setPerfumeSelectd(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda - Imágenes */}
        <div>
          <div className="relative mb-4 h-64 bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={perfumeSelectd.image[activeImageIndex] || ""}
              alt={perfumeSelectd.name}
              className="w-full h-full object-contain transition-transform duration-500"
            />
            
            {/* Botones de navegación */}
            {perfumeSelectd.image.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => 
                    prev === 0 ? perfumeSelectd.image.length - 1 : prev - 1
                  )}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => 
                    prev === perfumeSelectd.image.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Indicadores de posición */}
            {perfumeSelectd.image.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {perfumeSelectd.image.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeImageIndex 
                        ? 'bg-white w-4' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Miniaturas */}
          {perfumeSelectd.image.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {perfumeSelectd.image.map((img, index) => (
                <div 
                  key={index} 
                  className={`h-16 bg-gray-100 rounded overflow-hidden cursor-pointer transition-all ${
                    index === activeImageIndex ? 'ring-2 ring-blue-500' : 'hover:opacity-75'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${perfumeSelectd.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna derecha - Información */}
        <div>
          {/* Precio y Cantidad editables */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
              <input
                type="number"
                value={perfumeSelectd.price}
                onChange={(e) => setPerfumeSelectd({...perfumeSelectd, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input
                type="number"
                value={perfumeSelectd.quantity}
                onChange={(e) => setPerfumeSelectd({...perfumeSelectd, quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>

          {/* Detalles del perfume */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900">Notas Olfativas</h4>
              <p className="text-gray-700">{perfumeSelectd.notes}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Base</h4>
                <p className="text-gray-700">{perfumeSelectd.base}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Corazón</h4>
                <p className="text-gray-700">{perfumeSelectd.corazon}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900">Duración</h4>
                <p className="text-gray-700">{perfumeSelectd.duration}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Género</h4>
                <p className="text-gray-700 capitalize">{perfumeSelectd.gender || perfumeSelectd.genero}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Origen</h4>
              <p className="text-gray-700">{perfumeSelectd.origin}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setPerfumeSelectd(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                // Aquí iría la lógica para guardar los cambios
                console.log("Datos actualizados:", perfumeSelectd);
                setPerfumeSelectd(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
