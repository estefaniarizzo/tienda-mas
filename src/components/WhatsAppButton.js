import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ product }) => {
  const handleClick = () => {
    const phone = '+573028459856'; // Reemplaza con número real de WhatsApp
    const message = encodeURIComponent(product.whatsapp_message || `Hola, quiero pedir mas informacion de sus productos.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={handleClick}
    >
      <div className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer">
        <MessageCircle className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

export default WhatsAppButton;