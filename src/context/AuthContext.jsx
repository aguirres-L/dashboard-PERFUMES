import { createContext, useContext, useState, useEffect } from 'react';
import { updateDocumentFirebase, getDocumentByFieldFirebase } from '../services/data-firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const updateUserStatus = async (userId, isOnline) => {
    if (userId) {
      await updateDocumentFirebase('users', userId, { isOnline });
    }
  };

  const login = async (username) => {
    try {
      const userData = await getDocumentByFieldFirebase('users', 'usuario', username);
      if (userData) {
        setCurrentUser(userData);
        setIsAuthenticated(true);
        await updateUserStatus(userData.idFirestore, true);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        await updateUserStatus(currentUser.idFirestore, false);
      }
      setIsAuthenticated(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Manejar el estado online/offline cuando el usuario cierra la ventana
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (currentUser) {
        await updateUserStatus(currentUser.idFirestore, false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout,
      currentUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 