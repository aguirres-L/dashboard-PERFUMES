import { useEffect, useState } from 'react';

import AnimatedSection from '../utils/AnimatedSection';
import { useOrders } from './context/ContextGetAllOrders';
import OrderList from './ventas/components/OrderList';
import OrderModal from './ventas/components/OrderModal';

const Ventas = () => {
  // Sample data (en una app real vendría de props o API)
  const initialCart = [
    {
      brand: "Swiss Arabian",
      description: "Una fragancia intensa que captura la esencia del oud árabe con toques de azafrán y rosas.",
      id: 3,
      image: "https://example.com/perfume3.jpg",
      name: "Shaghaf Oud",
      notes: "Oud, Azafrán, Rosa, Ámbar",
      origin: "Emiratos Árabes",
      price: 180,
      quantity: 1,
      status: "pending",
      idFirestore: "0fbUFhUFS2DKbnR2125Z"
    },
    {
      brand: "Arabian Oud",
      description: "Una fragancia cálida y seductora con notas de ámbar, miel y sándalo.",
      id: 6,
      image: "https://example.com/perfume6.jpg",
      name: "Kalemat",
      notes: "Ámbar, Miel, Sándalo, Vainilla",
      origin: "Arabia Saudita",
      price: 200,
      quantity: 1,
      status: "pending",
      idFirestore: "1abUFhUFS2DKbnR2125A"
    },
    {
      brand: "Mancera",
      description: "Una fresca interpretación del oud con notas cítricas y un toque refrescante de menta.",
      id: 5,
      image: "https://example.com/perfume5.jpg",
      name: "Aoud Lemon Mint",
      notes: "Oud, Limón, Menta, Almizcle",
      origin: "Francia",
      price: 240,
      quantity: 3,
      status: "pending",
      idFirestore: "2cdUFhUFS2DKbnR2125B"
    }
  ];

  const [cart, setCart] = useState(initialCart);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');


  const [isLoading, setIsLoading] = useState(true);
  /* 
   */

  const { orders, loading, error, setIsUpdated } = useOrders();
  /* 
  if (loading) return <div>Cargando órdenes...</div>;
  if (error) return <div>Error al cargar órdenes: {error.message}</div>;
   */
  /* const handleRefresh = () => {
    // Forzar recarga de datos
    setIsUpdated(Date.now());
  };
   */
  /*  */



  // Simular carga de datos
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);


  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleStatusChange = (e) => {
    const updatedStatus = e.target.value;
    setSelectedProduct({ ...selectedProduct, status: updatedStatus });

    const updatedCart = cart.map(item =>
      item.idFirestore === selectedProduct.idFirestore
        ? { ...item, status: updatedStatus }
        : item
    );
    setCart(updatedCart);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: 'admin',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleConfirmOrder = () => {
    const updatedCart = cart.map(item =>
      item.idFirestore === selectedProduct.idFirestore
        ? { ...item, status: 'confirmed' }
        : item
    );
    setCart(updatedCart);
    handleCloseModal();
  };

  const filteredCart = cart.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">

        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Cargando datos del dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white mx-auto p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {orders.length} órdenes
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar pedido..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmado</option>
          </select>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="min-h-[calc(100vh-200px)]">
        <OrderList
          orders={orders}
          onOrderClick={handleProductClick}
        />
      </div>

      {/* Modal */}
      {selectedProduct && showModal && (
        <OrderModal
          selectedProduct={selectedProduct}
          onClose={handleCloseModal}
          onConfirmOrder={handleConfirmOrder}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default Ventas;  