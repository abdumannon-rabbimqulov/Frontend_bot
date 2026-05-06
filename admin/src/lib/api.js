import axios from 'axios';
import { getToken, logout } from './auth.js';

const baseURL = import.meta.env.VITE_API_BASE || '';

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      logout();
      if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/login')) {
        window.location.assign('/admin/login');
      }
    }
    return Promise.reject(err);
  },
);

export const auth = {
  loginWithTelegram: (init_data) => http.post('/auth/login', { init_data }).then((r) => r.data),
  me: () => http.get('/auth/me').then((r) => r.data),
};

export const dashboard = {
  stats: () => http.get('/admin/dashboard/stats').then((r) => r.data),
};

export const users = {
  list: (params = {}) =>
    http.get('/admin/users', { params }).then((r) => r.data),
  get: (id) => http.get(`/admin/users/${id}`).then((r) => r.data),
  update: (id, data) => http.patch(`/admin/users/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/admin/users/${id}`).then((r) => r.data),
};

export const orders = {
  list: (params = {}) => http.get('/admin/orders', { params }).then((r) => r.data),
  get: (id) => http.get(`/admin/orders/${id}`).then((r) => r.data),
  update: (id, data) => http.patch(`/admin/orders/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/admin/orders/${id}`).then((r) => r.data),
};

export const aiLogs = {
  list: (params = {}) => http.get('/admin/ai/commands', { params }).then((r) => r.data),
};

export const drivers = {
  locations: () => http.get('/admin/drivers/locations').then((r) => r.data),
  location: (id) => http.get(`/admin/drivers/${id}/location`).then((r) => r.data),
};

export const truckTypes = {
  list: () => http.get('/drivers/truck-types').then((r) => r.data),
  create: (data) => http.post('/drivers/truck-types', data).then((r) => r.data),
  update: (id, data) => http.patch(`/drivers/truck-types/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/drivers/truck-types/${id}`).then((r) => r.data),
};

export const tariffs = {
  listAll: (params = {}) =>
    http.get('/admin/tariffs/payments/all', { params }).then((r) => r.data),
  listForUser: (user_id, year) =>
    http
      .get(`/admin/tariffs/users/${user_id}/payments`, { params: year ? { year } : {} })
      .then((r) => r.data),
  summary: (user_id, year) =>
    http
      .get(`/admin/tariffs/users/${user_id}/summary`, { params: { year } })
      .then((r) => r.data),
  create: (data) => http.post('/admin/tariffs/payments', data).then((r) => r.data),
  update: (id, data) => http.patch(`/admin/tariffs/payments/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/admin/tariffs/payments/${id}`).then((r) => r.data),
};

export function buildWsUrl(path) {
  const base = baseURL || window.location.origin;
  const url = new URL(path, base);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  const token = getToken();
  if (token) url.searchParams.set('token', token);
  return url.toString();
}
