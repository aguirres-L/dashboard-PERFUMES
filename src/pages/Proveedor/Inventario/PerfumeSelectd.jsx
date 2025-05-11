import React, { useState } from "react";
import { updateDocumentFirebase, deleteDocumentFirebase } from "../../../services/data-firebase";

export default function PerfumeSelectd({ perfume, onClose, onUpdate }) {
  const [editPerfume, setEditPerfume] = useState({ ...perfume });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPerfume((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await updateDocumentFirebase(
        "perfumes",
        editPerfume.idFirestore || editPerfume.id,
        editPerfume
      );
      setSuccess(true);
      onUpdate && onUpdate(editPerfume);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError("Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deleteDocumentFirebase("perfumes", editPerfume.idFirestore || editPerfume.id);
      setSuccess(true);
      onUpdate && onUpdate();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError("Error al eliminar perfume");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2929292a] bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{editPerfume.name}</h3>
            <p className="text-lg text-gray-600">{editPerfume.brand}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="relative mb-4 h-64 bg-gray-100 rounded-lg overflow-hidden group">
              <img
                src={editPerfume.image?.[activeImageIndex] || ""}
                alt={editPerfume.name}
                className="w-full h-full object-contain transition-transform duration-500"
              />
              {/* Botones de navegación */}
              {editPerfume.image?.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => prev === 0 ? editPerfume.image.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => prev === editPerfume.image.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              {/* Indicadores de posición */}
              {editPerfume.image?.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {editPerfume.image.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === activeImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/75'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Miniaturas */}
            {editPerfume.image?.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {editPerfume.image.map((img, index) => (
                  <div
                    key={index}
                    className={`h-16 bg-gray-100 rounded overflow-hidden cursor-pointer transition-all ${index === activeImageIndex ? 'ring-2 ring-blue-500' : 'hover:opacity-75'}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${editPerfume.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Información y edición */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  name="price"
                  value={editPerfume.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  name="quantity"
                  value={editPerfume.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Notas Olfativas</h4>
                <textarea
                  name="notes"
                  value={editPerfume.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Base</h4>
                  <input
                    name="base"
                    value={editPerfume.base}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Corazón</h4>
                  <input
                    name="corazon"
                    value={editPerfume.corazon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Duración</h4>
                  <input
                    name="duration"
                    value={editPerfume.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Género</h4>
                  <input
                    name="genero"
                    value={editPerfume.genero || editPerfume.gender || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Origen</h4>
                <input
                  name="origin"
                  value={editPerfume.origin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Detalles</h4>
                <textarea
                  name="details"
                  value={editPerfume.details}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading || deleting}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading || deleting}
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading || deleting}
              >
                Guardar Cambios
              </button>
            </div>
            {/* Modal de confirmación de borrado */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <p>¿Estás seguro de que quieres eliminar este perfume? Esta acción no se puede deshacer.</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 border rounded">Cancelar</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded" disabled={deleting}>
                      {deleting ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  {success && <p className="text-green-500 mt-2">¡Eliminado!</p>}
                </div>
              </div>
            )}
            {/* Modal de confirmación de guardado */}
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                  <p>¿Estás seguro de que quieres guardar los cambios?</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border rounded">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
                      {loading ? "Guardando..." : "Confirmar"}
                    </button>
                  </div>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  {success && <p className="text-green-500 mt-2">¡Guardado!</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 