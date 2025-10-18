import React, { useState } from 'react';
import { createOrder } from '../utils/OrderService';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { items, updateQty, removeItem, clear, totalPrice } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    tipoCliente: '',
  });

  const handleCheckout = () => {
    if (!items.length) return alert('El carrito está vacío');
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address, tipoCliente } = form;
    if (!name || !phone || !address || !tipoCliente) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const total = totalPrice();

    // Guardar pedido en Supabase con datos del cliente
    const error = await createOrder({
      items,
      totalPrice: total,
      name,
      phone,
      address,
      tipoCliente,
    });

    if (error) {
      alert('No se pudo guardar el pedido en la base de datos.');
      return;
    }

    // Construir mensaje WhatsApp
    const lines = items.map(
      (i) => `• ${i.qty} x ${i.name} ($${i.price.toLocaleString()})`
    );

    const tipo =
      tipoCliente === 'horeca' ? 'HORECA (Hoteles, Restaurantes o Cafeterías)' : 'Natural';

    const rawMessage =
      `¡Hola!, Soy ${name}, vivo en ${address} y mi número de teléfono es ${phone}.\n\n` +
      `Soy un cliente ${tipo}.\n\n` +
      `Quiero hacer el siguiente pedido:\n\n${lines.join('\n')}\n\n` +
      `Total del pedido: $${total.toLocaleString()}\n\n¡Gracias!`;

    const message = encodeURIComponent(rawMessage);
    window.open(`https://wa.me/573028459856?text=${message}`, '_blank');

    setShowForm(false);
    clear();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tu Carrito</h2>

      {items.length === 0 ? (
        <p>El carrito está vacío. Agrega productos para empezar.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center gap-4 p-4 bg-white rounded shadow"
              >
                <img
                  src={it.image_url || it.image}
                  alt={it.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{it.name}</h3>
                  <p className="text-sm text-gray-600">${it.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(it.id, Math.max(1, it.qty - 1))}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{it.qty}</span>
                  <button
                    onClick={() => updateQty(it.id, it.qty + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="ml-4 text-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <button
                onClick={clear}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Vaciar carrito
              </button>
            </div>

            <div className="text-right">
              <p className="font-bold">
                Total: ${totalPrice().toLocaleString()}
              </p>
              <button
                onClick={handleCheckout}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
              >
                Finalizar pedido
              </button>

              {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <form
                    onSubmit={handleFormSubmit}
                    className="bg-white p-8 pb-12 rounded-xl shadow-lg w-full max-w-md space-y-4 relative overflow-visible"
                  >
                    <h3 className="text-xl font-bold mb-2">
                      Datos para el pedido
                    </h3>

                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre completo"
                      value={form.name}
                      onChange={handleFormChange}
                      className="w-full border px-4 py-2 rounded"
                      required
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Teléfono"
                      value={form.phone}
                      onChange={handleFormChange}
                      className="w-full border px-4 py-2 rounded"
                      required
                    />

                    <input
                      type="text"
                      name="address"
                      placeholder="Dirección"
                      value={form.address}
                      onChange={handleFormChange}
                      className="w-full border px-4 py-2 rounded"
                      required
                    />

                    <select
                      name="tipoCliente"
                      value={form.tipoCliente}
                      onChange={handleFormChange}
                      className="w-full border px-4 py-2 rounded"
                      required
                    >
                      <option value="">Selecciona tipo de cliente</option>
                      <option value="natural">Cliente Natural</option>
                      <option value="horeca">Cliente HORECA</option>
                    </select>

                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 bg-gray-200 rounded"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded"
                      >
                        Enviar pedido
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
