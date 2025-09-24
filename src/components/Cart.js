import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, updateQty, removeItem, clear, totalPrice } = useCart();

  const handleCheckout = () => {
    if (!items.length) return alert('El carrito está vacío');
    const lines = items.map(i => `- ${i.qty} x ${i.name} (${i.price})`);
    const total = totalPrice();
    const message = encodeURIComponent(`Hola, quiero hacer este pedido:%0A${lines.join('%0A')}%0ATotal: $${total.toLocaleString()}%0AMétodo de pago: Efectivo o Nequi`);
    window.open(`https://wa.me/573000000000?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tu Carrito</h2>
      {items.length===0 ? (
        <p>El carrito está vacío. Agrega productos para empezar.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map(it => (
              <div key={it.id} className="flex items-center gap-4 p-4 bg-white rounded shadow">
                <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold">{it.name}</h3>
                  <p className="text-sm text-gray-600">{it.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(it.id, Math.max(1, it.qty-1))} className="px-3 py-1 bg-gray-200 rounded">-</button>
                  <span>{it.qty}</span>
                  <button onClick={() => updateQty(it.id, it.qty+1)} className="px-3 py-1 bg-gray-200 rounded">+</button>
                </div>
                <button onClick={() => removeItem(it.id)} className="ml-4 text-red-600">Eliminar</button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <button onClick={clear} className="px-4 py-2 bg-red-600 text-white rounded">Vaciar carrito</button>
            </div>
            <div className="text-right">
              <p className="font-bold">Total: ${totalPrice().toLocaleString()}</p>
              <button onClick={handleCheckout} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">Finalizar por WhatsApp</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
