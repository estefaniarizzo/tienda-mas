import React from 'react';
import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import { offers } from '../mock/products';

const OffersSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ofertas del Mes
          </h2>
          <p className="text-xl text-gray-600">
            Ahorra en tus favoritos del campo. ¡Solo por tiempo limitado!
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="relative h-40 bg-gradient-to-br from-orange-100 to-amber-100">
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Percent className="w-4 h-4" />
                  20% OFF
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{offer.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{offer.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-orange-600">{offer.offerPrice}</span>
                    <span className="text-lg text-gray-400 line-through ml-4">{offer.originalPrice}</span>
                  </div>
                  <button
                    onClick={() => {
                      const message = encodeURIComponent(`Hola, quiero el ${offer.name} en oferta - Precio: ${offer.offerPrice}`);
                      window.open(`https://wa.me/1234567890?text=${message}`, '_blank');
                    }}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
                  >
                    Pedir Ahora
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;