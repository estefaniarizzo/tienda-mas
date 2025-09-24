import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Edit, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          quantity,
          status,
          total_price,
          created_at,
          product_id(id, name),
          user_id(id, username),
          name,
          phone,
          address
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Agrupa por nombre, teléfono y dirección
      const grouped = {};
      (data || []).forEach(order => {
        const key = `${order.name || 'Anónimo'}|${order.phone || ''}|${order.address || ''}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(order);
      });
      setOrders(grouped);
    } catch (err) {
      setError('Error al cargar pedidos: ' + err.message);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (error) {
      alert('Error al actualizar: ' + error.message);
    } else {
      fetchOrders();
    }
  };

  const statusOptions = ['pendiente', 'enviado', 'entregado', 'cancelado'];

  if (loading) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Package className="w-12 h-12 text-green-500 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">Cargando pedidos...</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Package className="w-5 h-5 text-green-600" />
        Pedidos Pendientes
      </h2>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}

      {showUpdate && editingOrder && (
        <motion.div className="bg-white/90 p-6 rounded-2xl border border-gray-200/50">
          <h3 className="font-bold mb-4">Actualizar Estado de Pedido #{editingOrder.id.slice(-4)}</h3>
          <select
            value={editingOrder.status}
            onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex gap-3 mt-4">
            <motion.button
              onClick={() => {
                updateOrderStatus(editingOrder.id, editingOrder.status);
                setShowUpdate(false);
                setEditingOrder(null);
              }}
              className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <Edit className="w-4 h-4 mr-2 inline" />
              Guardar
            </motion.button>
            <button
              onClick={() => {
                setShowUpdate(false);
                setEditingOrder(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {Object.entries(orders).map(([key, pedidos]) => {
          const [nombre, telefono, direccion] = key.split('|');
          return (
            <motion.div
              key={key}
              className="p-4 rounded-xl border border-yellow-200 bg-yellow-50"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-2">
                <p className="font-bold">{nombre}</p>
                {telefono && <p className="text-sm text-gray-600">Teléfono: {telefono}</p>}
                {direccion && <p className="text-sm text-gray-600">Dirección: {direccion}</p>}
              </div>
              <div className="space-y-1">
                {pedidos.map(order => (
                  <div key={order.id} className="grid grid-cols-12 gap-2 items-center py-1">
                    <div className="col-span-5 font-medium truncate">{order.product_id.name} (x{order.quantity})</div>
                    <div className="col-span-3 text-right text-sm text-gray-700">${order.total_price}</div>
                    <div className="col-span-3 flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === 'pendiente'
                          ? 'bg-yellow-200 text-yellow-800'
                          : order.status === 'enviado'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => {
                          setEditingOrder(order);
                          setShowUpdate(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Creado: {new Date(pedidos[0].created_at).toLocaleDateString()}</p>
            </motion.div>
          );
        })}
      </div>

      {Object.keys(orders).length === 0 && (
        <motion.div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">No hay pedidos</h3>
          <p className="text-gray-400">¡El negocio está en marcha!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminOrders;