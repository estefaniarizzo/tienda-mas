import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Banner = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-400 to-emerald-600 text-white py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Descubre la Frescura del Campo
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Hortalizas, huevos y productos naturales directo de nuestra finca. Calidad que se siente en cada bocado.
          </p>
          <motion.a
            href="#catalogo"
            className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-100 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explora Nuestros Productos
            <ArrowRight className="ml-2 w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-orange-300/20 rounded-full"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
    </section>
  );
};

export default Banner;