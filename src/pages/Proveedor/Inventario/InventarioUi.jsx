import React, { useState, useEffect } from "react";
import AnimatedSection from "../../../utils/AnimatedSection";
import { FiPlusCircle, FiSearch, FiX } from "react-icons/fi";
import { addDocumentFirebase, updateDocumentFirebase, getDocumentsFirebase } from "../../../services/data-firebase";
import { useProducts } from "../../../context/ContextProduct";
import { base } from "framer-motion/client";
import AddPerfume from "./AddPerfume";
import PerfumeSelectd from "./PerfumeSelectd";

export default function InventarioUi({
  addToOrder,
  searchTerm,
  setSearchTerm,
  filteredPerfumes: _filteredPerfumes, // ya no lo usaremos
}) {
  const [showNewPerfumeForm, setShowNewPerfumeForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const { setIsSend, isSend } = useProducts();
  const [perfumeSelectd, setPerfumeSelectd] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [perfumes, setPerfumes] = useState([]);
  const [loadingPerfumes, setLoadingPerfumes] = useState(false);

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
    image: [],
    genero: '',
    details: '',
  });

  // Fetch perfumes from Firestore
  const fetchPerfumes = async () => {
    setLoadingPerfumes(true);
    try {
      const data = await getDocumentsFirebase("perfumes");
      setPerfumes(data);
    } catch (e) {
      console.error("Error al obtener perfumes:", e);
    } finally {
      setLoadingPerfumes(false);
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  // Filtro local
  const filteredPerfumes = perfumes.filter((perfume) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      perfume.name?.toLowerCase().includes(term) ||
      perfume.brand?.toLowerCase().includes(term) ||
      perfume.origin?.toLowerCase().includes(term)
    );
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

  const handleSubmitNewPerfume = async (e) => {
    e.preventDefault();
    try {
      await addDocumentFirebase("perfumes", newPerfume);
      setIsSend(!isSend);
      await fetchPerfumes(); // Recarga la lista
    } catch (error) {
      console.error("Error al agregar el nuevo perfume:", error);
    }
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
        <div className="mb-6">
          {/* Header */}
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

        {loadingPerfumes ? (
          <div className="text-center py-10 text-gray-500">Cargando perfumes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPerfumes?.map((perfume) => (
              <div
                key={perfume.idFirestore || perfume.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => setPerfumeSelectd(perfume)}
              >
                <img
                  src={perfume.image?.[0] || ""}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      addToOrder(perfume);
                    }}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                  >
                    <FiPlusCircle className="mr-2" /> Agregar a pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* Modal para editar perfume */}
      {perfumeSelectd && (
        <PerfumeSelectd
          perfume={perfumeSelectd}
          onClose={() => setPerfumeSelectd(null)}
          onUpdate={async (updated) => {
            await fetchPerfumes();
            setPerfumeSelectd(null);
          }}
        />
      )}
    </div>
  );
}
