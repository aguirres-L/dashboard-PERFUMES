import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlusCircle, FiSearch, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import AnimatedSection from '../utils/AnimatedSection';
import InventarioUi from './Proveedor/Inventario/InventarioUi';
import NuevoPedidoUi from './Proveedor/nuevo_pedido/NuevoPedidoUI';
import OrdenesUI from './Proveedor/ordenes/OrdenesUI';
import { useProducts } from '../context/ContextProduct';

// Datos de ejemplo para perfumes disponibles
const samplePerfumes = [
    {
        brand: "Mancera",
        description: "Una fresca interpretación del oud con notas cítricas y un toque refrescante de menta.",
        id: 1,
        image: "https://via.placeholder.com/150",
        name: "Aoud Lemon Mint",
        notes: "Oud, Limón, Menta, Almizcle",
        origin: "Francia",
        price: 240,
        quantity: 3,
        status: "available",
        idFirestore: "2cdUFhUFS2DKbnR2125B"
    },
    {
        brand: "Chanel",
        description: "Un clásico floral aldehído que ha definido la elegancia durante décadas.",
        id: 2,
        image: "https://via.placeholder.com/150",
        name: "N°5",
        notes: "Aldehídos, Ylang-ylang, Vainilla, Ámbar",
        origin: "Francia",
        price: 120,
        quantity: 10,
        status: "available",
        idFirestore: "3abGFhGFS3EKcnT3136C"
    },
    {
        brand: "Dior",
        description: "Una explosión fresca y especiada con notas de pimienta y lavanda.",
        id: 3,
        image: "https://via.placeholder.com/150",
        name: "Sauvage",
        notes: "Pimienta, Lavanda, Vainilla, Ámbar",
        origin: "Francia",
        price: 95,
        quantity: 8,
        status: "low-stock",
        idFirestore: "4deHIhIFS4FLdoT4147D"
    },
    {
        brand: "Creed",
        description: "Un aroma fresco y acuático inspirado en las montañas escocesas.",
        id: 4,
        image: "https://via.placeholder.com/150",
        name: "Silver Mountain Water",
        notes: "Bergamota, Té verde, Almizcle, Sándalo",
        origin: "Reino Unido",
        price: 280,
        quantity: 2,
        status: "available",
        idFirestore: "5efIJhJFS5GMepT5158E"
    }
];

// Datos de ejemplo para pedidos existentes
const sampleOrders = [
    {
        id: "ORD-001",
        date: "2023-05-15",
        status: "completed",
        items: [
            { ...samplePerfumes[0], orderedQuantity: 5 },
            { ...samplePerfumes[1], orderedQuantity: 3 }
        ],
        total: 1695
    },
    {
        id: "ORD-002",
        date: "2023-06-20",
        status: "shipped",
        items: [
            { ...samplePerfumes[2], orderedQuantity: 4 },
            { ...samplePerfumes[3], orderedQuantity: 2 }
        ],
        total: 1240
    },
    {
        id: "ORD-003",
        date: "2023-07-10",
        status: "pending",
        items: [
            { ...samplePerfumes[1], orderedQuantity: 2 },
            { ...samplePerfumes[3], orderedQuantity: 1 }
        ],
        total: 520
    }
];

const Proveedor = () => {
    const [perfumes, setPerfumes] = useState(null);
    const [orders, setOrders] = useState(sampleOrders);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('inventory');
    const [newOrder, setNewOrder] = useState({
        items: [],
        notes: '',
        deliveryDate: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const { products, loading, error } = useProducts();


    // Simular carga de datos
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            console.log(products,'products');
            setPerfumes(products);
            setIsLoading(false);
        }, 1000);
    }, [loading]);

    // Filtrar perfumes basados en el término de búsqueda
    const filteredPerfumes = perfumes?.filter(perfume =>
        perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Agregar perfume al nuevo pedido
    const addToOrder = (perfume) => {
        const existingItem = newOrder.items.find(item => item.id === perfume.id);

        if (existingItem) {
            setNewOrder({
                ...newOrder,
                items: newOrder.items.map(item =>
                    item.id === perfume.id
                        ? { ...item, orderedQuantity: item.orderedQuantity + 1 }
                        : item
                )
            });
        } else {
            setNewOrder({
                ...newOrder,
                items: [...newOrder.items, { ...perfume, orderedQuantity: 1 }]
            });
        }
    };
    
    // Remover perfume del nuevo pedido
    const removeFromOrder = (perfumeId) => {
        setNewOrder({
            ...newOrder,
            items: newOrder.items.filter(item => item.id !== perfumeId)
        });
    };

    // Actualizar cantidad en el nuevo pedido
    const updateQuantity = (perfumeId, quantity) => {
        if (quantity <= 0) {
            removeFromOrder(perfumeId);
            return;
        }

        setNewOrder({
            ...newOrder,
            items: newOrder.items.map(item =>
                item.id === perfumeId
                    ? { ...item, orderedQuantity: parseInt(quantity) }
                    : item
            )
        });
    };

    // Enviar nuevo pedido
    const submitOrder = (e) => {
        e.preventDefault();

        const newOrderObj = {
            id: `ORD-${orders.length + 100}`,
            date: new Date().toISOString().split('T')[0],
            status: "pending",
            items: newOrder.items,
            notes: newOrder.notes,
            deliveryDate: newOrder.deliveryDate,
            total: newOrder.items.reduce((sum, item) => sum + (item.price * item.orderedQuantity), 0)
        };

        setOrders([...orders, newOrderObj]);
        setNewOrder({ items: [], notes: '', deliveryDate: '' });

        alert(`Pedido ${newOrderObj.id} creado exitosamente!`);
    };

    // Obtener ícono según estado del pedido
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FiClock className="text-yellow-500" />;
            case 'shipped':
                return <FiTruck className="text-blue-500" />;
            case 'completed':
                return <FiCheckCircle className="text-green-500" />;
            default:
                return <FiPackage className="text-gray-500" />;
        }
    };

    // Obtener color según estado del pedido
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

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
        <div className="container mx-auto p-4 md:p-6">


            <AnimatedSection delay={0.3}>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Gestión de Proveedores</h1>
                {/* Pestañas */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2  cursor-pointer px-4 font-medium ${activeTab === 'inventory' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        <FiPackage className="inline mr-2" /> Inventario
                    </button>
                    <button
                        className={`py-2 cursor-pointer  px-4 font-medium ${activeTab === 'newOrder' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('newOrder')}
                    >
                        <FiPlusCircle className="inline mr-2" /> Nuevo Pedido
                    </button>
                    <button
                        className={`py-2  cursor-pointer px-4 font-medium ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <FiTruck className="inline mr-2" /> Pedidos Existentes
                    </button>
                </div>

                {/* Contenido de las pestañas */}
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                    {/* Pestaña de Inventario */}
                    {activeTab === 'inventory' && (
                        <>
                            <InventarioUi addToOrder={addToOrder} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filteredPerfumes={filteredPerfumes} />
                        </>
                    )}

                    {/* Pestaña de Nuevo Pedido */}
                    {activeTab === 'newOrder' && (
                        <NuevoPedidoUi newOrder={newOrder} setNewOrder={setNewOrder} submitOrder={submitOrder} removeFromOrder={removeFromOrder} updateQuantity={updateQuantity} />
                    )}

                    {/* Pestaña de Pedidos Existentes */}
                    {activeTab === 'orders' && (
                        <OrdenesUI orders={orders} getStatusIcon={getStatusIcon} getStatusColor={getStatusColor} />
                    )}
                </div>


            </AnimatedSection>
        </div>
    );
};

export default Proveedor;