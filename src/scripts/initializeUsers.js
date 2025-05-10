    import { setDocumentFirebase } from '../services/data-firebase';

// Datos iniciales de usuarios
const initialUsers = [
  {
    idFirestore: 'user_agustin',  // ID personalizado
    nombre: 'Agustín',
    usuario: 'agustin',
    isOnline: false,
    role: 'admin',
    lastLogin: null
  },
  {
    idFirestore: 'user_meli',
    nombre: 'Melisa',
    usuario: 'meli',
    isOnline: false,
    role: 'user',
    lastLogin: null
  },
  {
    idFirestore: 'user_mati',
    nombre: 'Matías',
    usuario: 'mati',
    isOnline: false,
    role: 'user',
    lastLogin: null
  }
];

// Función para inicializar usuarios
export const initializeUsers = async () => {
  try {
    for (const user of initialUsers) {
      await setDocumentFirebase('users', user.idFirestore, user);
      console.log(`Usuario ${user.nombre} inicializado correctamente`);
    }
    console.log('Todos los usuarios han sido inicializados');
  } catch (error) {
    console.error('Error al inicializar usuarios:', error);
  }
};

// Para ejecutar la inicialización, descomenta la siguiente línea:
// initializeUsers(); 