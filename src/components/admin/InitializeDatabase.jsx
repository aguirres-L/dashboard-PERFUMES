import React, { useState } from 'react';
import { initializeUsers } from '../../scripts/initializeUsers';

const InitializeDatabase = () => {
  const [status, setStatus] = useState('');

  const handleInitialize = async () => {
    try {
      setStatus('Inicializando usuarios...');
      await initializeUsers();
      setStatus('¡Usuarios inicializados correctamente!');
    } catch (error) {
      setStatus('Error al inicializar: ' + error.message);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleInitialize}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        Inicializar Base de Datos
      </button>
      {status && (
        <div className="mt-2 p-2 bg-white rounded-lg shadow text-sm">
          {status}
        </div>
      )}
    </div>
  );
};

export default InitializeDatabase; 