import axios from 'axios';
import { getRefreshToken, getToken, logout } from './auth.js';

/** Barcha so‘rovlar /api siz; admin REST SPA dan ajratish uchun /system prefiksi. */
const root = import.meta.env.VITE_API_ROOT ?? '';

function bearerAdmin(config) {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}

export const httpAuthPublic = axios.create({
  baseURL: root,
  headers: { 'Content-Type': 'application/json' },
});

export const httpAuth = axios.create({
  baseURL: root,
  headers: { 'Content-Type': 'application/json' },
});
httpAuth.interceptors.request.use(bearerAdmin);

export const http = axios.create({
  baseURL: root,
  headers: { 'Content-Type': 'application/json' },
});
http.interceptors.request.use(bearerAdmin);

function on401Logout(err) {
  const status = err?.response?.status;
  if (status === 401) {
    logout();
    if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/login')) {
      window.location.assign('/admin/login');
    }
  }
  return Promise.reject(err);
}

http.interceptors.response.use((r) => r, on401Logout);
httpAuth.interceptors.response.use((r) => r, on401Logout);

export const auth = {
  loginWithTelegram: (init_data) =>
    httpAuthPublic.post('/auth/telegram-webapp-login', { init_data }).then((r) => r.data),
  loginWithPhone: (phone_number, password) =>
    httpAuthPublic.post('/auth/login', { phone_number, password }).then((r) => r.data),
  me: () => httpAuth.get('/auth/me').then((r) => r.data),
  logout: () => {
    const refresh_token = getRefreshToken();
    if (!refresh_token) return Promise.resolve({ detail: 'No refresh token' });
    return httpAuth.post('/auth/logout', { refresh_token }).then((r) => r.data);
  },
};

export const dashboard = {
  stats: () => http.get('/system/dashboard/stats').then((r) => r.data),
};

export const users = {
  list: (params = {}) =>
    http.get('/system/users', { params }).then((r) => r.data),
  get: (id) => http.get(`/system/users/${id}`).then((r) => r.data),
  update: (id, data) => http.patch(`/system/users/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/system/users/${id}`).then((r) => r.data),
};

export const orders = {
  list: (params = {}) => http.get('/system/orders', { params }).then((r) => r.data),
  get: (id) => http.get(`/system/orders/${id}`).then((r) => r.data),
  update: (id, data) => http.patch(`/system/orders/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/system/orders/${id}`).then((r) => r.data),
};

export const aiLogs = {
  list: (params = {}) => http.get('/system/ai/commands', { params }).then((r) => r.data),
};

export const drivers = {
  locations: () => http.get('/system/drivers/locations').then((r) => r.data),
  location: (id) => http.get(`/system/drivers/${id}/location`).then((r) => r.data),
};

export const truckTypes = {
  list: () => http.get('/drivers/truck-types').then((r) => r.data),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return http
      .post('/drivers/truck-types/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  create: (data) => http.post('/drivers/truck-types', data).then((r) => r.data),
  update: (id, data) => http.patch(`/drivers/truck-types/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/drivers/truck-types/${id}`).then((r) => r.data),
};

export const tariffs = {
  listAll: (params = {}) =>
    http.get('/system/tariffs/payments/all', { params }).then((r) => r.data),
  listForUser: (user_id, year) =>
    http
      .get(`/system/tariffs/users/${user_id}/payments`, { params: year ? { year } : {} })
      .then((r) => r.data),
  summary: (user_id, year) =>
    http
      .get(`/system/tariffs/users/${user_id}/summary`, { params: { year } })
      .then((r) => r.data),
  create: (data) => http.post('/system/tariffs/payments', data).then((r) => r.data),
  update: (id, data) => http.patch(`/system/tariffs/payments/${id}`, data).then((r) => r.data),
  remove: (id) => http.delete(`/system/tariffs/payments/${id}`).then((r) => r.data),
};

export function buildWsUrl(path) {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(normalizedPath, `${base}/`);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  const token = getToken();
  if (token) url.searchParams.set('token', token);
  return url.toString();
}
