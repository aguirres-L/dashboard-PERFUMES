import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDocumentsFirebase } from '../../services/data-firebase';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdated, setIsUpdated] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const querySnapshot = await getDocumentsFirebase('orders');
                const ordersData = querySnapshot;
                console.log(ordersData, 'ordersData from firebase');
                
                setOrders(ordersData);
            } catch (err) {
                console.error("Error fetching orders: ", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isUpdated]);

    return (
        <OrdersContext.Provider value={{ 
            orders, 
            loading, 
            error,
            setIsUpdated,
            isUpdated,
            setOrders // Opcional: en caso que quieras actualizar manualmente
        }}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => {
    return useContext(OrdersContext);
};

export default OrdersContext;