import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-emerald-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6">Campo Fresco</h3>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Tu proveedor confiable de productos del campo. Frescura garantizada.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+1 234 567 890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>info@campofresco.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Finca El Verde, Rural</span>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <p>&copy; 2023 Campo Fresco. Todos los derechos reservados.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;