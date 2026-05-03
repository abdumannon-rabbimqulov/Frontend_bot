const API_BASE_URL = 'https://logistic.org.uz';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const api = {
  // Fetch all orders for the current user
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Yuklarni olishda xatolik yuz berdi');
    return await response.json();
  },

  // Fetch offers for a specific order
  getOrderOffers: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/offers`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Takliflarni olishda xatolik yuz berdi');
    return await response.json();
  },

  // Accept a driver's offer
  acceptOffer: async (offerId) => {
    const response = await fetch(`${API_BASE_URL}/orders/offers/${offerId}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'accepted' }),
    });
    if (!response.ok) throw new Error('Taklifni tasdiqlashda xatolik yuz berdi');
    return await response.json();
  },

  // Create a new order (cargo)
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Yuk yaratishda xatolik yuz berdi');
    return await response.json();
  }
};
