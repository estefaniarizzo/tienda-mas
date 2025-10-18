import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-emerald-800 to-green-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Nombre y descripción */}
          <h3 className="text-2xl font-bold mb-4 tracking-wide">Tienda Más y Más</h3>
          <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
            Tu tienda de confianza para productos hortalizas y desechables, de alta calidad y a los mejores precios.
          </p>

          {/* Contacto */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8 text-gray-200">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+573028459856</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>contacto@tiendamasymas.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Tenjo, Cundinamarca, Colombia</span>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="flex justify-center gap-6 mb-8">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition-colors duration-300"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-300 transition-colors duration-300"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>

          {/* Derechos */}
          <div className="border-t border-emerald-700 pt-6">
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} Tienda Más y Más. Todos los derechos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
