import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE || '/api';

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('driver_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  loginWithTelegram: (init_data) =>
    http.post('/auth/login', { init_data }).then((r) => r.data),

  me: () => http.get('/auth/me').then((r) => r.data),
};

export const driverProfile = {
  create: (data) => http.post('/drivers/profile', data).then((r) => r.data),
  me: () => http.get('/drivers/me').then((r) => r.data),
  update: (data) => http.patch('/drivers/me', data).then((r) => r.data),
};

export const truckTypes = {
  list: () => http.get('/drivers/truck-types').then((r) => r.data),
};

// Driver loads & offers (mock-ready for UI)
export const loads = {
  list: (params = {}) => http.get('/drivers/loads', { params }).then((r) => r.data).catch(() => []),
  get: (id) => http.get(`/drivers/loads/${id}`).then((r) => r.data).catch(() => null),
};

export const offers = {
  create: (loadId, data) => http.post(`/drivers/loads/${loadId}/offers`, data).then((r) => r.data),
};

export const trips = {
  active: () => http.get('/drivers/trips/active').then((r) => r.data).catch(() => null),
  updateLocation: (lat, lng) => http.post('/drivers/location', { lat, lng }),
  updateStatus: (status, note) => http.post('/drivers/trips/status', { status, note }),
};
