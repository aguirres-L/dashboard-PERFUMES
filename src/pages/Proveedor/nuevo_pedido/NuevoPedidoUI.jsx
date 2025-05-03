import AnimatedSection from "../../../utils/AnimatedSection";
import { FiPackage, FiPlusCircle, FiSearch, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';

export default function NuevoPedidoUi({ newOrder, setNewOrder, submitOrder, removeFromOrder, updateQuantity }) {
    return (
        <div>
        <AnimatedSection delay={0.1}>
  
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Nuevo Pedido al Proveedor</h2>
              
              {newOrder?.items.length === 0 ? (
                <div className="text-center py-12">
                  <FiPackage className="mx-auto text-gray-400 text-5xl mb-4" />
                  <p className="text-gray-500">No hay productos en el pedido</p>
                  <p className="text-gray-400 mt-2">Agrega productos desde la pestaña de Inventario</p>
                </div>
              ) : (
                <form onSubmit={submitOrder}>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Productos en el pedido</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {newOrder.items.map(item => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <img className="h-10 w-10 rounded-full" src={item.image} alt={item.name} />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    <div className="text-sm text-gray-500">{item.brand}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${item.price}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.orderedQuantity}
                                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                                  className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${item.price * item.orderedQuantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() => removeFromOrder(item.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-500">Total del pedido:</td>
                            <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                              ${newOrder.items.reduce((sum, item) => sum + (item.price * item.orderedQuantity), 0)}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha esperada de entrega</label>
                      <input
                        type="date"
                        id="deliveryDate"
                        value={newOrder.deliveryDate}
                        onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                      <textarea
                        id="notes"
                        rows="3"
                        value={newOrder.notes}
                        onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Instrucciones especiales para este pedido..."
                      ></textarea>
                    </div>
                  </div>
  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center"
                    >
                      <FiCheckCircle className="mr-2" /> Enviar Pedido
                    </button>
                  </div>
                </form>
              )}
  
  
                    </AnimatedSection>
            </div>
    )
}