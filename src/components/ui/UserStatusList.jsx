import React, { useEffect, useState } from 'react';
import { db } from '../../services/data-firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const UserStatusList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Crear una suscripción a la colección de usuarios
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        idFirestore: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    }, (error) => {
      console.error('Error escuchando cambios de usuarios:', error);
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-4 border-t border-blue-700 pt-4">
      <h3 className="text-lg font-semibold mb-3 text-white">Usuarios</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.idFirestore}
            className="flex items-center space-x-2 text-white"
          >
            <div className="relative">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className={`absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white ${
                  user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                }`}
              />
            </div>
            <span className="text-sm">{user.nombre}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                user.isOnline
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-gray-500/20 text-gray-300'
              }`}
            >
              {user.isOnline ? 'En línea' : 'Desconectado'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatusList; 