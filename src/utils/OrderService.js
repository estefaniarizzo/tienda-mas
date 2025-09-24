import { supabase } from '../utils/supabase';

export async function createOrder({ items, totalPrice, name, phone, address }) {
  // Prepara el payload para la tabla orders
  // Inserta cada producto como un registro individual en la tabla orders
  const now = new Date().toISOString();
  const payload = items.map(i => {
    let price = i.price;
    if (typeof price === 'number') {
      price = price < 1000 ? price * 1000 : price;
    } else if (typeof price === 'string') {
      const m = price.match(/\$([0-9.,]+)/);
      price = m ? Number(m[1].replace(/\./g, '')) : 0;
    }
    return {
      product_id: i.id,
      quantity: i.qty,
      status: 'pendiente',
      total_price: price * (i.qty || 1),
      created_at: now,
      name,
      phone,
      address,
      image_url: i.image_url || i.image // soporta ambos campos
    };
  });
  const { error } = await supabase.from('orders').insert(payload);
  return error;
}
