import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const handleWhatsApp = () => {
    const phone = '+573028459856'; // Reemplaza con tu número real
    const message = encodeURIComponent(
      product.whatsapp_message || `Hola, quiero pedir ${product.name}.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300"
      />
      <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-green-600">${product.price}</span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {product.category}
        </span>
      </div>
      <motion.button
        onClick={handleWhatsApp}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ShoppingBag className="w-5 h-5" />
        Pedir por WhatsApp
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;
