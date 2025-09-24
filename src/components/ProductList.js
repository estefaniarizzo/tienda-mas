import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onWhatsApp, loading, error }) => {
  if (loading) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Cargando productos frescos...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Ups, algo salió mal. {error}</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onWhatsApp={onWhatsApp} />
      ))}
      {products.length === 0 && (
        <motion.div
          className="col-span-full text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-500 mb-2">Nada encontrado</h3>
          <p className="text-gray-400">Prueba con otro filtro o búsqueda.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ProductList;