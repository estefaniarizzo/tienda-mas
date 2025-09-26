import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, X } from 'lucide-react';
import { supabase } from '../utils/supabase';

const ProductForm = ({ onProductAdded, editingProduct = null, onSave = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    category: editingProduct?.category || '',
    price: editingProduct?.price || '',
    description: editingProduct?.description || '',
    image_url: editingProduct?.image_url || '',
    whatsapp_message: editingProduct?.whatsapp_message || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['hortalizas', 'huevos', 'frutas','vegetales','tuberculos','hongos','desechables'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToInsert = {
        ...formData,
        price: parseFloat(formData.price)
      };

      let result;
      if (editingProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update(dataToInsert)
          .eq('id', editingProduct.id);
        if (updateError) throw updateError;
        result = { data: editingProduct }; // Simular para callback
      } else {
        const { data, error } = await supabase.from('products').insert([dataToInsert]).select();
        if (error) throw error;
        result = data[0];
      }

      if (onSave) onSave(result);
      onProductAdded?.();
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 shadow-lg"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={loading}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/([A-Z])/g, ' $1')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje WhatsApp</label>
            <input
              type="text"
              value={formData.whatsapp_message}
              onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Hola, quiero pedir este producto."
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <motion.button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4 mr-2 inline" />
            {editingProduct ? 'Actualizar' : 'Agregar Producto'}
          </motion.button>
          {editingProduct && (
            <motion.button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;