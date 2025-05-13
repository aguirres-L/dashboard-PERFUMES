import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../services/data-firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdated, setIsUpdated] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        // Usar onSnapshot directamente para escuchar la colección 'orders'
        const colRef = collection(db, 'orders');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ idFirestore: doc.id, ...doc.data() }));
            setOrders(ordersData);
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
        });
        return () => unsubscribe();
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