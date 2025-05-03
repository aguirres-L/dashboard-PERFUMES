import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import AnimatedSection from '../utils/AnimatedSection';

// Registrar componentes necesarios de Chart.js
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Datos simulados para el Balance
const generateSalesData = () => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months.map(month => ({
    month,
    sales: Math.floor(Math.random() * 5000) + 1000,
    investment: Math.floor(Math.random() * 3000) + 500,
    lastMonthOrders: Math.floor(Math.random() * 200) + 50,
    currentMonthOrders: Math.floor(Math.random() * 300) + 70
  }));
};

const topPerfumes = [
  { name: 'Chanel N°5', sales: 1250 },
  { name: 'Dior Sauvage', sales: 980 },
  { name: 'Versace Eros', sales: 870 },
  { name: 'Jean Paul Gaultier', sales: 760 },
  { name: 'Armani Acqua di Giò', sales: 690 },
];

const Balance = () => {
  const [salesData, setSalesData] = useState([]);
  const [timeRange, setTimeRange] = useState('year');
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSalesData(generateSalesData());
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  // Configuración común para los gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Datos para el gráfico de ventas mensuales
  const salesChartData = {
    labels: salesData.map(data => data.month),
    datasets: [
      {
        label: 'Ventas ($)',
        data: salesData.map(data => data.sales),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de inversiones
  const investmentChartData = {
    labels: salesData.map(data => data.month),
    datasets: [
      {
        label: 'Inversión ($)',
        data: salesData.map(data => data.investment),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        tension: 0.1,
      },
    ],
  };

  // Datos para el gráfico de perfumes más vendidos
  const topPerfumesChartData = {
    labels: topPerfumes.map(perfume => perfume.name),
    datasets: [
      {
        label: 'Unidades vendidas',
        data: topPerfumes.map(perfume => perfume.sales),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico comparativo de pedidos a proveedores
  const ordersComparisonData = {
    labels: ['Mes anterior', 'Mes actual'],
    datasets: [
      {
        label: 'Pedidos a proveedores',
        data: [
          salesData.length > 0 ? salesData[salesData.length - 2].lastMonthOrders : 0,
          salesData.length > 0 ? salesData[salesData.length - 1].currentMonthOrders : 0
        ],
        backgroundColor: [
          'rgba(255, 159, 64, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <AnimatedSection delay={0.3}>

        <div className=" mx-auto">
          {/* Header del dashboard */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas por {timeRange === "year" ? "Año" : "Mes"} - Perfumería</h1>
            <div className="flex justify-between items-center mt-4">
              <p className="text-gray-600">Resumen completo de las métricas del negocio</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-4 cursor-pointer py-2 rounded-md ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-4 cursor-pointer py-2 rounded-md ${timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                >
                  Anual
                </button>
              </div>
            </div>
          </header>

          {/* Grid de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 font-medium">Ventas totales</h3>
              <p className="text-3xl font-bold mt-2">
                ${salesData.reduce((acc, curr) => acc + curr.sales, 0).toLocaleString()}
              </p>
              <p className="text-green-600 mt-2">+12% vs período anterior</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 font-medium">Inversión total</h3>
              <p className="text-3xl font-bold mt-2">
                ${salesData.reduce((acc, curr) => acc + curr.investment, 0).toLocaleString()}
              </p>
              <p className="text-blue-600 mt-2">+8% vs período anterior</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 font-medium">Perfumes vendidos</h3>
              <p className="text-3xl font-bold mt-2">
                {topPerfumes.reduce((acc, curr) => acc + curr.sales, 0).toLocaleString()}
              </p>
              <p className="text-green-600 mt-2">+15% vs período anterior</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500 font-medium">Pedidos a proveedores</h3>
              <p className="text-3xl font-bold mt-2">
                {salesData.length > 0 ? salesData[salesData.length - 1].currentMonthOrders : 0}
              </p>
              <p className="text-red-600 mt-2">-5% vs mes anterior</p>
            </div>
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gráfico de ventas mensuales */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Ventas  {timeRange === "year" ? "Anuales" : "Mensuales"}</h2>
              <div className="h-80">
                <Bar data={salesChartData} options={chartOptions} />
              </div>
            </div>

            {/* Gráfico de inversiones */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Inversión {timeRange === "year" ? "Anual" : "Mensual"}</h2>
              <div className="h-80">
                <Line data={investmentChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Gráficos secundarios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top perfumes más vendidos */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Perfumes más vendidos en el {timeRange === "year" ? "Año" : "Mes"} </h2>
              <div className="h-96">
                <Pie data={topPerfumesChartData} options={chartOptions} />
              </div>
            </div>

            {/* Comparación de pedidos a proveedores */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Pedidos a proveedores en el {timeRange === "year" ? "Año" : "Mes"}</h2>
              <div className="h-96">
                <Bar
                  data={ordersComparisonData}
                  options={{
                    ...chartOptions,
                    indexAxis: 'y',
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>


        </div>
      </AnimatedSection>

    </div>
  );
};

export default Balance;