import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDocumentsFirebase } from '../services/data-firebase';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isSend, setIsSend] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocumentsFirebase('perfumes');
                const productsData = querySnapshot 
                console.log(productsData,'productsData of firebase');
                
                setProducts(productsData);
            } catch (err) {
                console.error("Error fetching products: ", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isSend]);

    return (
        <ProductContext.Provider value={{ products, loading, error,setIsSend, isSend }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    return useContext(ProductContext);
};

export default ProductContext;