import React from 'react';
import OrderCard from './OrderCard';

interface OrderListProps {
  orders: any[];
  onOrderClick: (order: any) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onOrderClick }) => {
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay órdenes disponibles
        </h3>
        <p className="text-gray-500">
          Las órdenes aparecerán aquí cuando los clientes realicen compras.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-max">
      {orders.map((order) => (
        <OrderCard
          key={order.idFirestore}
          order={order}
          onOrderClick={onOrderClick}
        />
      ))}
    </div>
  );
};

export default OrderList; 