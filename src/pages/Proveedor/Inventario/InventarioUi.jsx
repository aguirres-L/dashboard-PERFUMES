import React, { useState } from "react";
import AnimatedSection from "../../../utils/AnimatedSection";
import { FiPlusCircle, FiSearch, FiX } from "react-icons/fi";
import { addDocumentFirebase } from "../../../services/data-firebase";
import { useProducts } from "../../../context/ContextProduct";
import { base } from "framer-motion/client";

export default function InventarioUi({
  addToOrder,
  searchTerm,
  setSearchTerm,
  filteredPerfumes,
}) {
  const [showNewPerfumeForm, setShowNewPerfumeForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

      const { setIsSend, isSend } = useProducts();
  

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
    duration:"",
    image: [], // ahora es un array para múltiples URLs
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
    });
    setNewImageUrl("");
    setShowNewPerfumeForm(false);
  };

  return (
    <div className="relative">
      <AnimatedSection delay={0.1}>
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

    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[100vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b p-4">
        <h3 className="text-xl font-semibold">Añadir Nuevo Perfume</h3>
        <button
          onClick={() => setShowNewPerfumeForm(false)}
          className="text- cursor-pointer  gray-500 hover:text-gray-700"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <form onSubmit={handleSubmitNewPerfume} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda: Nombre, Marca, Origen, Descripción */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del perfume
              </label>
              <input
                type="text"
                name="name"
                value={newPerfume.name}
                onChange={handleNewPerfumeChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                type="text"
                name="brand"
                value={newPerfume.brand}
                onChange={handleNewPerfumeChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origen
              </label>
              <input
                type="text"
                name="origin"
                value={newPerfume.origin}
                onChange={handleNewPerfumeChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salida
              </label>
              <input
                type="text"
                name="notes"
                value={newPerfume.notes}
                onChange={handleNewPerfumeChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Corazón
              </label>
              <input
                type="text"
                name="corazon"
                value={newPerfume.corazon}
                onChange={handleNewPerfumeChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base
              </label>
              <input
                type="text"
                name="base"
                value={newPerfume.base}
                onChange={handleNewPerfumeChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración
              </label>
              <input
                type="text"
                name="duration"
                value={newPerfume.duration}
                onChange={handleNewPerfumeChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

          </div>

          {/* Columna derecha: Notas, Precio, Cantidad, Imágenes */}
          <div className="space-y-4">
         

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={newPerfume.price}
                  onChange={handleNewPerfumeChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={newPerfume.quantity}
                  onChange={handleNewPerfumeChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Sección para agregar múltiples URLs de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URLs de Imágenes
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ingresa la URL de la imagen"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-3 rounded-md"
                >
                  Agregar
                </button>
              </div>
              {newPerfume.image.length > 0 && (
                <ul className="mt-2  space-y-1">
                  {newPerfume.image.map((url, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border p-2 rounded"
                    >
                      <span className="text-sm truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(index)}
                        className="text-red-600 cursor-pointer hover:text-red-800 text-xs"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={() => setShowNewPerfumeForm(false)}
            className="px-4 cursor-pointer py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Perfume
          </button>
        </div>
      </form>
    </div>
    </AnimatedSection>
  </div>
)}
    </div>
  );
}
