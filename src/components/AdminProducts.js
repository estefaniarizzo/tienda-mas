import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';
import ProductForm from './ProductForm';

const AdminProducts = ({ onProductAdded }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
    }
    setLoading(false);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('¿Seguro que quieres borrar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error al borrar: ' + error.message);
    } else {
      fetchProducts();
      onProductAdded();
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = () => {
    fetchProducts();
    setShowForm(false);
    setEditingProduct(null);
    onProductAdded();
  };

  if (loading) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Cargando productos...</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-600" />
          Gestión de Productos
        </h2>
        <motion.button
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Agregar Nuevo
        </motion.button>
      </div>

      {showForm && (
        <ProductForm
          editingProduct={editingProduct}
          onProductAdded={handleSaveProduct}
          onCancel={handleFormClose}
          onSave={handleSaveProduct}
        />
      )}

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 shadow-lg"
            whileHover={{ y: -2 }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-32 object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-green-600">${product.price}</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">{product.category}</span>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => handleEditProduct(product)}
                className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl hover:bg-blue-100"
                whileHover={{ scale: 1.02 }}
              >
                <Edit className="w-4 h-4 mr-1 inline" />
                Editar
              </motion.button>
              <motion.button
                onClick={() => handleDeleteProduct(product.id)}
                className="px-3 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100"
                whileHover={{ scale: 1.02 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <motion.div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">No hay productos</h3>
          <p className="text-gray-400">Agrega el primero para empezar.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminProducts;