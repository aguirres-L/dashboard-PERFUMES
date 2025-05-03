import React, { useState } from "react";
import SvgMenuOpen from "../ui/svg/SvgMenuOpen";
import SvgMenuClose from "../ui/svg/SvgMenuClose";
import AnimatedSection from "../../utils/AnimatedSection";
import Ventas from "../../pages/Ventas";
import Balance from "../../pages/Balance";
import Proveedor from "../../pages/Proveedor";
import SvgLogout from "../ui/svg/SvgLogout";
import { ProductProvider } from "../../context/ContextProduct";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userNavigate, setUserNavigate] = useState('/ventas');

  // Datos del menú
  const menuItems = [
    {
      title: "Ventas",
      icon: "💰",
      path: "/ventas",
    },
    {
      title: "Balance",
      icon: "📊",
      path: "/balance",
    },
    {
      title: "Proveedores",
      icon: "🛒",
      path: "/proveedores",
    },
  ];

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    setUserNavigate(path);
  };

  // Función para cerrar sesión (personaliza según tu lógica)
  const handleLogout = () => {
    console.log("Cerrar sesión");
    // ... implementar lógica de logout ...
  };

  return (
    <div className="flex">
      {/* Sidebar fijo */}
      <div
        className={`fixed top-0 left-0 h-screen bg-blue-800 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-blue-700">
          {isSidebarOpen && <h1 className="text-xl font-bold">Mi Dashboard</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 cursor-pointer rounded-lg hover:bg-blue-700"
          >
            {isSidebarOpen ? <SvgMenuClose /> : <SvgMenuOpen />}
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center cursor-pointer w-full p-3 rounded-lg hover:bg-blue-700 ${
                    userNavigate === item.path ? "bg-blue-900" : ""
                  } ${!isSidebarOpen && "justify-center"}`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {isSidebarOpen && (
                    <AnimatedSection delay={0.3}>
                      <span className="ml-3">{item.title}</span>
                    </AnimatedSection>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            className={`mt-4 w-full flex items-center cursor-pointer p-3 rounded-lg transition-colors duration-300 bg-gray-400 hover:bg-gray-700 ${
              !isSidebarOpen && "justify-center"
            }`}
          >
            <span className="text-2xl flex-shrink-0">{<SvgLogout />}</span>
            {isSidebarOpen && (
              <AnimatedSection delay={0.3}>
                <span className="ml-3">Cerrar Sesión</span>
              </AnimatedSection>
            )}
          </button>
        </nav>
      </div>

      {/* Contenido Principal con margen para no quedar tapado */}
      <div className={`${isSidebarOpen ? "ml-64" : "ml-20"} w-full`}>
        <ProductProvider>

        {userNavigate === '/ventas' && <Ventas />}
        {userNavigate === '/proveedores' && <Proveedor />} 
        {userNavigate === '/balance' && <Balance />}
        
        </ProductProvider>
      </div>
    </div>
  );
};

export default Dashboard;