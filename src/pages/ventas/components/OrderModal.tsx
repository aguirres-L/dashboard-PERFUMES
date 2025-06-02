import React from 'react';
import AnimatedSection from '../../../utils/AnimatedSection';
import { motion } from 'framer-motion';
import { updateDocumentFirebase, deleteDocumentFirebase } from '../../../services/data-firebase';

interface OrderModalProps {
  selectedProduct: any;
  onClose: () => void;
  onConfirmOrder: () => void;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  selectedProduct,
  onClose,
  onConfirmOrder,
}) => {
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const newStatus = e.target.value;
      await updateDocumentFirebase("orders", selectedProduct.idFirestore, {
        estado: newStatus
      });
      
      // Actualizar la UI o recargar los datos según sea necesario
      if (newStatus === "completed") {
        onConfirmOrder();
      }
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error al actualizar el estado de la orden");
    }
  };

  const handleDeleteOrder = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.")) {
      try {
        await deleteDocumentFirebase("orders", selectedProduct.idFirestore);
        onClose();
      } catch (error) {
        alert("Error al eliminar la orden");
      }
    }
  };

  const generateWhatsAppMessage = () => {
    const message = `¡Hola ${selectedProduct.buyerInfo.nombre}! \n\n` +
      `Somos el equipo de *AURUM* y queremos agradecerte por tu compra \n\n` +
      `*Puedes dar seguimiento a tu pedido en:* https://consulta-tu-pedido.netlify.app/ usando tu numero de orden: ${selectedProduct.idFirestore} \n\n` +
      `*Para completar tu pedido:*\n` +
      `1. Realiza la transferencia a nuestra cuenta bancaria:\n\n` +
      ` *Alias:* TudoNum.Lemon\n` +
      ` *Titular:* Agustin Aguirres\n` +
      `2. Envíanos el comprobante de pago por este mismo medio\n` +
      `3. Nosotros verificaremos el pago y procederemos con tu pedido\n\n` +
      `*Datos de tu compra:*\n` +
      ` Productos: ${selectedProduct.cart.length}\n` +
      ` Total: $${selectedProduct.totalPrice.toFixed(3)}\n\n` +
      `¿Tienes alguna duda? Estamos aquí para ayudarte. ¡Gracias por elegir AURUM!\n\n`+
      `Tu clave de seguimiento : ${selectedProduct.idFirestore} `;

    return encodeURIComponent(message);
  };


  console.log(selectedProduct,'selectedProduct from screen order modal');
  

  return (
    <div  className="fixed inset-0 z-50 flex items-center  justify-center bg-black/30 backdrop-blur-sm  sm:p-0">
      <AnimatedSection   delay={0.1}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-[90%]  mx-auto  sm:p-6 bg-white rounded-xl "
        >
          <div className="text-sm sm:text-base border-red-600 ">
            {/* Header */}
            <div className="flex justify-between flex-col sticky top-0 bg-white z-10">

                  <div className=" flex flex-row w-full justify-between p-4  "  >

                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${selectedProduct.estado === "completed" ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
                  `}>
                  {selectedProduct.estado === "completed" ? 'Completado' : 'Pendiente'}
                </span>
                {selectedProduct.estado === "completed" && (
                  <button
                    onClick={handleDeleteOrder}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    Eliminar Orden
                  </button>
                )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Pedido {selectedProduct.idFirestore}
                </h3>



            </div>

            {/* Content */}
            <div className="p-2 sm:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Left Column */}
                <div className="lg:w-1/2 w-full">
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-6 border border-gray-100 space-y-4 sm:space-y-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Información del Cliente
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        {Object.entries(selectedProduct.buyerInfo).map(([key, value]) => (
                          <div key={key} className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="text-sm font-medium text-gray-500 capitalize">{key}</p>
                            <p className="text-gray-800 font-medium truncate" title={String(value)}>
                              {String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Fecha del pedido:</span>
                          <span className="text-gray-800 font-medium">{selectedProduct.fecha}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Estado actual:</span>
                          <span className={`font-medium ${selectedProduct.estado === "completed" ? 'text-green-600' : 'text-amber-600'}`}>
                            {selectedProduct.estado === "completed" ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                          <span>Total del pedido:</span>
                          <span className="text-gray-900">${selectedProduct.totalPrice.toFixed(3)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Products List */}
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Productos ({selectedProduct.cart.length})
                      </h4>
                      <div className="space-y-2 sm:space-y-4 overflow-x-auto max-h-[40vh] sm:max-h-[50vh] pr-1 sm:pr-2">
                        {selectedProduct.cart.map((product: any, index: number) => (
                          <div key={index} className="bg-white p-2 sm:p-4 rounded-lg shadow-sm">
                            <div className="flex gap-2 sm:gap-4">
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div className="pr-2">
                                    <h5 className="font-semibold text-gray-900 truncate">{product.name}</h5>
                                    <p className="text-sm text-gray-600 truncate">{product.brand}</p>
                                  </div>
                                  <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                                    ${(product.price * product.quantity).toFixed(2)}
                                  </p>
                                </div>
                                <div className="mt-2 flex justify-between text-xs sm:text-sm text-gray-500">
                                  <span>Cantidad: {product.quantity}</span>
                                  <span>Precio unitario: ${product.price}</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 text-xs">
                              <div>
                                <span className="font-medium text-gray-500">Notas:</span>
                                <p className="text-gray-600 truncate" title={product.notes}>{product.notes}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">Corazón:</span>
                                <p className="text-gray-600 truncate" title={product.corazon}>{product.corazon}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-500">Base:</span>
                                <p className="text-gray-600 truncate" title={product.base}>{product.base}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:w-1/2 w-full mt-4 lg:mt-0">
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Status Management */}
                    <div className="bg-gray-800 text-white p-4 sm:p-6">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Gestión del Pedido
                      </h4>
                    </div>

                    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                      {/* Order Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estado del pedido
                        </label>
                        <select
                          value={selectedProduct.estado || "pending"}
                          onChange={handleStatusChange}
                          className="w-full px-2 sm:px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                        >
                          <option value="pending" className="text-amber-600">Pendiente</option>
                          <option value="processing" className="text-blue-600">En proceso</option>
                          <option value="shipped" className="text-purple-600">Enviado</option>
                          <option value="completed" className="text-green-600">Completado</option>
                        </select>
                      </div>

                      {/* WhatsApp Communication */}
                      <div className="bg-gray-50 rounded-xl p-3 sm:p-6 border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-2 sm:mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Comunicación con el cliente
                        </h5>
                        
                        <a
                          href={`https://wa.me/${selectedProduct.buyerInfo.telefono}?text=${generateWhatsAppMessage()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors w-full mb-2 sm:mb-4 text-sm sm:text-base"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          </svg>
                          Enviar instrucciones por WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 gap-2 sm:gap-0">
                      <button
                        className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm sm:text-base w-full sm:w-auto"
                        onClick={() => window.print()}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimir Pedido
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
};

export default OrderModal; 