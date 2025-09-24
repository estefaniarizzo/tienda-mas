import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Edit, Trash2, UserPlus, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
    }
    setLoading(false);
  };

  const updateUserRole = async (userId, newRole) => {
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
    if (error) {
      alert('Error al actualizar: ' + error.message);
    } else {
      fetchUsers();
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('¿Borrar este usuario?')) return;
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) {
      alert('Error al borrar: ' + error.message);
    } else {
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <motion.div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Cargando usuarios...</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Gestión de Usuarios
        </h2>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}

      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Usuario</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Rol</th>
              <th className="text-left py-3 px-4">Creado</th>
              <th className="text-left py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <motion.tr
                key={user.id}
                className="border-b hover:bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <td className="py-3 px-4 font-medium">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="px-2 py-1 border border-gray-200 rounded text-sm"
                  >
                    <option value="user">Cliente</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <motion.button
                    onClick={() => deleteUser(user.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <motion.div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">No hay usuarios</h3>
          <p className="text-gray-400">¡Sé el primero en registrarte!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminUsers;