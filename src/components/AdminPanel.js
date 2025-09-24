import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Package, ShoppingBag, Users } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import { supabase } from '../utils/supabase';

const AdminPanel = ({ onLogout, onProductAdded, user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tabs disponibles en el panel admin
  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'products', label: 'Productos', icon: ShoppingBag },
    { key: 'orders', label: 'Pedidos', icon: Package },
    { key: 'users', label: 'Usuarios', icon: Users }
  ];

  // Render dinámico según tab activa
  const renderContent = () => {
    if (!session || user?.role !== 'admin') {
      return <div className="text-red-600 font-semibold">Acceso denegado 🚫</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts onProductAdded={onProductAdded} />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header del panel */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8" />
            Panel de Administración
          </h1>
          {session && (
            <motion.button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 hover:bg-red-100 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
              Salir ({user?.email})
            </motion.button>
          )}
        </div>

        {/* Tabs */}
        {session ? (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/50 p-6 mb-8">
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1 mb-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 min-w-max whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-white text-green-600 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Contenido dinámico */}
            {renderContent()}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Sesión expirada. Redirigiendo...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPanel;
