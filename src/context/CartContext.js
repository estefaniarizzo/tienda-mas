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
    // parse prices like "$10.000/kg" or "$18.000/docena" -> extract numbers
    const total = items.reduce((acc, it) => {
      const m = it.price && it.price.match(/\$([0-9.,]+)/);
      const num = m ? Number(m[1].replace(/\./g,'')) : 0;
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
