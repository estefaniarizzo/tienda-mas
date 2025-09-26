import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

const categories = ['Todas', 'hortalizas', 'huevos', 'plasticos', 'frutas','vegetales','tuberculos','hongos','desechables'];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <motion.div
      className="flex flex-wrap gap-2 mb-6 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Filter className="w-5 h-5 text-gray-500 mt-1 mr-2" />
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryFilter;