import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0, // 👈 Mantenemos como número
    totalUsers: 0,
    monthlySales: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchMonthlySales();
  }, []);

  // Función para formatear números en pesos colombianos
  const formatCOP = (amount) => {
    // Formato personalizado para mostrar como $18000 (sin decimales, con separador de miles)
    if (isNaN(amount)) return '$0';
    // Redondea y elimina decimales
    const rounded = Math.round(amount);
    // Formatea con separador de miles, sin decimales
    return '$' + rounded.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendiente');

      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'entregado');

      let totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0) || 0;
      // Si el total es menor a 1000, asumimos que está en miles y lo multiplicamos
      if (totalRevenue > 0 && totalRevenue < 1000) {
        totalRevenue = totalRevenue * 1000;
      }

      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });

      setStats(prev => ({
        ...prev,
        totalProducts: productCount || 0,
        pendingOrders: pendingCount || 0,
        totalRevenue: totalRevenue, // 👈 Guardamos como número
        totalUsers: userCount || 0
      }));
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
    setLoading(false);
  };

  const fetchMonthlySales = async () => {
    try {
      const { data } = await supabase
        .from('orders')
        .select('created_at, total_price')
        .eq('status', 'entregado')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const monthlyData = data?.reduce((acc, order) => {
        const month = new Date(order.created_at).toLocaleDateString('es-CO', { month: 'short' });
        acc[month] = (acc[month] || 0) + parseFloat(order.total_price || 0);
        return acc;
      }, {});

      setStats(prev => ({ ...prev, monthlySales: monthlyData || {} }));
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center items-center py-12" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </motion.div>
    );
  }

  const chartData = {
    labels: Object.keys(stats.monthlySales),
    datasets: [
      {
        label: 'Ventas Mensuales (COP)',
        data: Object.values(stats.monthlySales),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const statCards = [
    {
      icon: ShoppingBag,
      title: 'Productos',
      value: stats.totalProducts.toLocaleString('es-CO'), // 👈 Formateamos con separadores
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Package,
      title: 'Pedidos Pendientes',
      value: stats.pendingOrders.toLocaleString('es-CO'), // 👈 Formateamos con separadores
      color: 'from-yellow-500 to-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      icon: TrendingUp,
      title: 'Ingresos Totales',
      value: formatCOP(stats.totalRevenue), // 👈 Aplicamos formato COP aquí
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Usuarios',
      value: stats.totalUsers.toLocaleString('es-CO'), // 👈 Formateamos con separadores
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              className={`p-6 rounded-2xl border border-gray-200/50 ${card.bg} shadow-lg hover:shadow-xl transition-all`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 bg-gradient-to-br ${card.color} rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-600">{card.title}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-600">
            <BarChart3 className="w-5 h-5" />
            Ventas Recientes
          </h3>
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </motion.div>

        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Resumen
          </h3>
          <div className="space-y-2 text-sm">
            <p>• {stats.totalProducts.toLocaleString('es-CO')} productos listos para vender</p>
            <p>• {stats.pendingOrders.toLocaleString('es-CO')} pedidos necesitan atención</p>
            <p>• Ingresos: {formatCOP(stats.totalRevenue)} generados</p> {/* 👈 Formateamos aquí también */}
            <p>• {stats.totalUsers.toLocaleString('es-CO')} usuarios en la plataforma</p>
          </div>
          <p className="text-gray-600 mt-4">¡Tu imperio del campo crece! Revisa pedidos pendientes primero.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;