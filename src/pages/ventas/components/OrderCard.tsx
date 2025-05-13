import React from 'react';
import { motion } from 'framer-motion';

interface Product {
  idFirestore: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string[];
  notes: string;
  corazon: string;
  base: string;
}

interface BuyerInfo {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface OrderProps {
  order: {
    idFirestore: string;
    fecha: string;
    estado: string;
    totalPrice: number;
    buyerInfo: BuyerInfo;
    cart: Product[];
  };
  onOrderClick: (order: any) => void;
}

// Mapeo de labels y estilos para los estados
const estadoLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'En proceso',
  shipped: 'Enviado',
  completed: 'Completada',
};
const estadoStyles: Record<string, string> = {
  pending: 'bg-amber-500 text-white',
  processing: 'bg-blue-500 text-white',
  shipped: 'bg-purple-500 text-white',
  completed: 'bg-green-500 text-white',
};
const estadoGradients: Record<string, string> = {
  pending: 'bg-gradient-to-r from-amber-50 to-amber-100',
  processing: 'bg-gradient-to-r from-blue-50 to-blue-100',
  shipped: 'bg-gradient-to-r from-purple-50 to-purple-100',
  completed: 'bg-gradient-to-r from-green-50 to-green-100',
};

const OrderCard: React.FC<OrderProps> = ({ order, onOrderClick }) => {
  // Animación para el hover
  const cardVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      whileHover="hover"
      variants={cardVariants}
      onClick={() => onOrderClick(order)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Encabezado de la orden con gradiente */}
      <div 
        className={`p-5 ${
          estadoGradients[order.estado] || 'bg-gradient-to-r from-gray-50 to-gray-100'
        } border-b border-gray-100`}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-800">
                #{order.idFirestore}
              </h2>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium 
                ${estadoStyles[order.estado] || 'bg-gray-300 text-gray-700'}
              `}>
                {estadoLabels[order.estado] || 'Desconocido'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {new Date(order.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">
              ${order.totalPrice.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Información del comprador */}
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Información del comprador
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Nombre:</span>
              <span className="text-gray-600">{order.buyerInfo.nombre}</span>
            </p>
            <p className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-600">{order.buyerInfo.email}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Teléfono:</span>
              <span className="text-gray-600">{order.buyerInfo.telefono}</span>
            </p>
            <p className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Dirección:</span>
              <span className="text-gray-600 truncate" title={order.buyerInfo.direccion}>
                {order.buyerInfo.direccion}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="p-5">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Productos ({order.cart.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {order.cart.map((product, index) => (
            <div
              key={`${product.idFirestore}-${index}`}
              className="group relative bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-200"
            >
              <div className="flex gap-3">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white">
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      x{product.quantity}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ${(product.price * product.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Detalles del producto - visible en hover */}
              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                <p className="flex justify-between">
                  <span className="font-medium">Notas:</span>
                  <span className="truncate ml-2">{product.notes}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Corazón:</span>
                  <span className="truncate ml-2">{product.corazon}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Base:</span>
                  <span className="truncate ml-2">{product.base}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard; 