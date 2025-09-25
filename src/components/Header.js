import React from 'react';
import { motion } from 'framer-motion';
import { Search, User, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ onSearch, searchTerm, onLoginClick, isLoggedIn, userRole }) => {
  return (
    <motion.header
      className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <ShoppingBag className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">Más</span>
                  <span className="text-2xl font-bold text-orange-500 mx-1">&</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">Más</span>
                </div>
                <p className="text-sm text-gray-500">Una experiencia diferente.</p>
                <span className="text-2xl font-bold text-orange-400 mx-1">MINI-MARKET</span>
              </div>
          </Link>

          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            <Link to="/cart" className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-xl text-green-700 hover:bg-green-200 transition-all font-medium">
              <ShoppingBag className="w-5 h-5" />
              <span>Carrito</span>
            </Link>

            <motion.button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 hover:bg-green-100 transition-all font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-5 h-5" />
              {isLoggedIn ? `Hola, ${userRole}` : 'Iniciar Sesión'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;