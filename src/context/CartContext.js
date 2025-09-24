import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const found = prev.find(p => p.id === product.id);
      if (found) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + qty } : p);
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const updateQty = (id, qty) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, qty } : p));
  };

  const clear = () => setItems([]);

  const totalPrice = () => {
    // Soporta precios numéricos y string en COP
    const total = items.reduce((acc, it) => {
      let num = 0;
      if (typeof it.price === 'number') {
        // Si el precio es menor a 1000, asumimos que está en miles (mock)
        num = it.price < 1000 ? it.price * 1000 : it.price;
      } else if (typeof it.price === 'string') {
        // Si es string, extrae el número
        const m = it.price.match(/\$([0-9.,]+)/);
        num = m ? Number(m[1].replace(/\./g, '')) : 0;
      }
      return acc + num * (it.qty || 1);
    }, 0);
    return total;
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
