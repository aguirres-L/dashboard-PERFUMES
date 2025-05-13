import { useState, useEffect, useRef } from 'react';
import { USERS_CREDENTIALS } from '../config/users';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => { setShow(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = USERS_CREDENTIALS.find(
      u => u.usuario === formData.usuario && u.password === formData.password
    );

    if (user) {
      await login(formData.usuario);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Animación para cada letra
  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: -50,
      scale: 0.5
    },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }),
    hover: {
      y: -10,
      scale: 1.1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  // Animación para las palabras
  const wordVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div 
        className=" p-10 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={wordVariants}
      >
        {/* Primera palabra "My" */}
        <motion.span 
          className="inline-block"
          variants={wordVariants}
        >
          {Array.from("My").map((letter, index) => (
            <motion.span
              key={`my-${index}`}
              className="inline-block text-5xl font-extrabold text-blue-600"
              custom={index}
              variants={letterVariants}
              whileHover="hover"
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
        
        {/* Espacio */}
        <span className="inline-block w-4"></span>
        
        {/* Segunda palabra "Dashboard" */}
        <motion.span 
          className="inline-block"
          variants={wordVariants}
          initial={{ x: 50 }}
        >
          {Array.from("Dashboard").map((letter, index) => (
            <motion.span
              key={`dashboard-${index}`}
              className="inline-block text-5xl font-extrabold text-indigo-600"
              custom={index + 2} // Delay diferente para la segunda palabra
              variants={letterVariants}
              whileHover="hover"
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </motion.div>

      <motion.div 
        className="bg-white p-8 rounded-xl shadow-lg w-96"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.8,
          type: "spring",
          damping: 10,
          stiffness: 100
        }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesión
        </h2>
        
        {error && (
          <motion.div 
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0px 5px 15px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ 
              scale: 0.98,
              boxShadow: "0px 2px 5px rgba(59, 130, 246, 0.4)"
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            Iniciar Sesión
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;