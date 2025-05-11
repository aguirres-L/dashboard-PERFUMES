import React from "react";

export default function AddPerfume({
  newPerfume,
  setNewPerfume,
  newImageUrl,
  setNewImageUrl,
  handleAddImageUrl,
  handleRemoveImageUrl,
  handleSubmitNewPerfume,
  onCancel
}) {
  // Handler para cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPerfume({ ...newPerfume, [name]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[100vh] overflow-y-auto">
      <div className="flex justify-between items-center border-b p-4">
        <h3 className="text-xl font-semibold">Añadir Nuevo Perfume</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmitNewPerfume} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del perfume
              </label>
              <input
                type="text"
                name="name"
                value={newPerfume.name}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Textarea para detalles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detalles del perfume
              </label>
              <textarea
                name="details"
                value={newPerfume.details || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                placeholder="Agrega detalles adicionales del perfume"
              />
            </div>
          </div>
          {/* Columna derecha */}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            {/* Género */}
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="masculino"
                  name="genero"
                  value="masculino"
                  checked={newPerfume.genero === 'masculino'}
                  onChange={e => setNewPerfume({ ...newPerfume, genero: e.target.checked ? 'masculino' : '' })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="masculino" className="ml-2 block text-sm text-gray-700">
                  Masculino
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="femenino"
                  name="genero"
                  value="femenino"
                  checked={newPerfume.genero === 'femenino'}
                  onChange={e => setNewPerfume({ ...newPerfume, genero: e.target.checked ? 'femenino' : '' })}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="femenino" className="ml-2 block text-sm text-gray-700">
                  Femenino
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="unisex"
                  name="genero"
                  value="unisex"
                  checked={newPerfume.genero === 'unisex'}
                  onChange={e => setNewPerfume({ ...newPerfume, genero: e.target.checked ? 'unisex' : '' })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="unisex" className="ml-2 block text-sm text-gray-700">
                  Unisex
                </label>
              </div>
            </div>
            {/* URLs de imágenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URLs de Imágenes
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
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
                <ul className="mt-2 space-y-1">
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
            onClick={onCancel}
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
  );
} 