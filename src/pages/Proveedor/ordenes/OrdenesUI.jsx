import AnimatedSection from "../../../utils/AnimatedSection";
import { FiPackage, FiPlusCircle, FiSearch, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';



export default function OrdenesUI( { orders, getStatusIcon, getStatusColor }) {
    return (
        <div>
        <AnimatedSection delay={0.1}>
  <h2 className="text-xl font-semibold text-gray-800 mb-6">Historial de Pedidos</h2>
  
  {orders.length === 0 ? (
    <div className="text-center py-12">
      <FiPackage className="mx-auto text-gray-400 text-5xl mb-4" />
      <p className="text-gray-500">No hay pedidos registrados</p>
    </div>
  ) : (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order.id} className="border rounded-lg overflow-hidden">
          <div className={`px-4 py-3 flex justify-between items-center ${getStatusColor(order.status)}`}>
            <div className="flex items-center">
              {getStatusIcon(order.status)}
              <span className="ml-2 font-medium">
                {order.status === 'pending' ? 'Pendiente' : 
                 order.status === 'shipped' ? 'Enviado' : 'Completado'}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Pedido #{order.id}</span> - {order.date}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Productos:</h4>
              <ul className="space-y-3">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.brand} - {item.orderedQuantity} unidades</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-900">${item.price * item.orderedQuantity}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
              <div>
                {order.deliveryDate && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Entrega esperada:</span> {order.deliveryDate}
                  </p>
                )}
                {order.notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Notas:</span> {order.notes}
                  </p>
                )}
              </div>
              <p className="text-lg font-bold text-gray-900">Total: ${order.total}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
        </AnimatedSection>
</div>
    );
}