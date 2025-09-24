import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { products } from '../mock/products';

const ProductCatalog = () => {
  return (
    <section id="catalogo" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Nuestro Catálogo
          </h2>
          <p className="text-xl text-gray-600">
            Productos frescos y naturales, listos para tu mesa.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;