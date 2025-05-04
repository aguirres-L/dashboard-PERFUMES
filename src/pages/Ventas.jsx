import { useEffect, useState } from 'react';
 
import AnimatedSection from '../utils/AnimatedSection';
import { useOrders } from './context/ContextGetAllOrders';

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
    <div className=" bg-white mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Ventas </h1>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Buscar pedido..." 
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmado</option>
          </select>
        </div>
      </div>

       <div className="space-y-6">
        {orders.map(order => (
          <div key={order.idFirestore}   onClick={() => handleProductClick(order)} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Encabezado de la orden */}
            <div className={`p-4 ${order.estado ? 'bg-green-100' : 'bg-yellow-100'} border-b`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Orden #{order.idFirestore.substring(0, 8)}</h2>
                  <p className="text-gray-600">Fecha: {order.fecha}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                    ${order.estado ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                    {order.estado ? 'Completada' : 'Pendiente'}
                  </span>
                  <p className="text-lg font-bold mt-1">Total: ${order.totalPrice}</p>
                </div>
              </div>
            </div>

            {/* Información del comprador */}
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900 mb-2">Información del comprador</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">Nombre:</span> {order.buyerInfo.nombre}</p>
                  <p><span className="font-medium">Email:</span> {order.buyerInfo.email}</p>
                </div>
                <div>
                  <p><span className="font-medium">Teléfono:</span> {order.buyerInfo.telefono}</p>
                  <p><span className="font-medium">Dirección:</span> {order.buyerInfo.direccion}</p>
                </div>
              </div>
            </div>

            {/* Productos de la orden */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Productos ({order.cart.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.cart.map((product, index) => (
                  <div 
                    key={`${product.idFirestore}-${index}`} 
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex space-x-4">
                      <img 
                        src={product.image[0]} 
                        alt={product.name} 
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                        <p className="text-sm">Cantidad: {product.quantity}</p>
                        <p className="text-sm font-medium">${product.price} c/u</p>
                        <p className="text-sm">Subtotal: ${(product.price * product.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                      <p><span className="font-medium">Notas:</span> {product.notes}</p>
                      <p><span className="font-medium">Corazón:</span> {product.corazon}</p>
                      <p><span className="font-medium">Base:</span> {product.base}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

{/* Modal de detalle de pedido */}
        {console.log(selectedProduct, 'selectedProduct')}
        {selectedProduct && showModal && (
  <div  className="fixed inset-0 z-50 flex items-center justify-center bg-[#2929292a] bg-opacity-50 backdrop-blur-sm">
    <AnimatedSection delay={0.1}>
      <div  className="bg-white rounded-lg shadow-xl w-[96vw]   mx-4 max-h-[100vh] overflow-y-auto transform transition-all">
        {/* Encabezado del modal */}
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-bold text-gray-800">Detalle del Pedido #{selectedProduct.idFirestore.substring(0, 6)}</h3>
          <button 
            onClick={handleCloseModal} 
            className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none focus:outline-none transition-colors"
          >
            &times;
          </button>
        </div>
        
        {/* Contenido principal */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Columna Izquierda: Detalles del pedido */}
            <div className="lg:w-1/2">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                {/* Información del comprador */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Información del Cliente</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Nombre</p>
                      <p className="text-gray-800 font-medium">{selectedProduct.buyerInfo.nombre}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="text-gray-800 font-medium">{selectedProduct.buyerInfo.telefono}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800 font-medium">{selectedProduct.buyerInfo.email}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-500">Dirección</p>
                      <p className="text-gray-800 font-medium">{selectedProduct.buyerInfo.direccion}</p>
                    </div>
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Productos ({selectedProduct.cart.length})</h4>
                  <div className="space-y-4">
                    {selectedProduct.cart.map((product, index) => (
                      <div key={index} className="flex gap-4 p-3 border border-gray-200 rounded-lg bg-white">
                        <img 
                          src={product.image[0]} 
                          alt={product.name} 
                          className="w-20 h-20 object-contain rounded"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h5 className="font-bold text-gray-900">{product.name}</h5>
                            <p className="text-gray-800 font-medium">${product.price}</p>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Cantidad: {product.quantity}</span>
                            <span>Subtotal: ${(parseFloat(product.price) * product.quantity).toFixed(3)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen del pedido */}
                <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha del pedido:</span>
                    <span className="text-gray-800 font-medium">{selectedProduct.fecha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado actual:</span>
                    <span className={`font-medium ${
                      selectedProduct.estado ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {selectedProduct.estado ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total del pedido:</span>
                    <span className="text-gray-900">${selectedProduct.totalPrice.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Columna Derecha: Gestión del pedido */}
            <div className="lg:w-1/2">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Encabezado */}
                <div className="bg-gray-800 text-white p-4">
                  <h5 className="font-semibold text-lg">Gestión del Pedido</h5>
                </div>
                
                {/* Contenido */}
                <div className="p-4 space-y-4">
                  {/* Estado del pedido */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado del pedido</label>
                    <select 
                      value={selectedProduct.estado ? "completed" : "pending"} 
                      onChange={handleStatusChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="pending" className="text-yellow-600">Pendiente</option>
                      <option value="processing" className="text-blue-600">En proceso</option>
                      <option value="shipped" className="text-purple-600">Enviado</option>
                      <option value="completed" className="text-green-600">Completado</option>
                    </select>
                  </div>
                  
                  {/* Comentarios */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
                    <textarea 
                      rows="3" 
                      placeholder="Agregar notas internas..." 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    ></textarea>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  {/* Chat con el cliente */}
                  <div>
                    <h6 className="font-semibold text-gray-800 mb-2">Comunicación con el cliente</h6>
                    <div className="chat-messages mb-3 p-3 border border-gray-200 rounded-lg h-48 overflow-y-auto bg-gray-50">
                      {messages.length > 0 ? (
                        messages.map((msg, index) => (
                          <div 
                            key={index} 
                            className={`mb-3 ${msg.sender === 'admin' ? 'pl-10' : 'pr-10'}`}
                          >
                            <div 
                              className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'admin' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                            >
                              <p>{msg.text}</p>
                              <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'}`}>
                                {msg.timestamp}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No hay mensajes aún
                        </div>
                      )}
                    </div>
                    
                    {/* Input de mensaje */}
                    <div className="flex shadow-sm">
                      <input 
                        type="text" 
                        placeholder="Escribe un mensaje..." 
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button 
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Pie del modal */}
                <div className="bg-gray-100 px-4 py-3 flex justify-between border-t border-gray-200">
                  <button 
                    onClick={handleConfirmOrder}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      selectedProduct.estado 
                        ? 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500' 
                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {selectedProduct.estado ? 'Pedido Completado' : 'Marcar como Completado'}
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    </svg>
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  </div>
)}
    
    </div>
  );
};

export default Ventas;  