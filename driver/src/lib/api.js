import axios from 'axios';

/** Barcha so‘rovlar backend yo‘liga mos (/api prefiks yo‘q). */
const root = import.meta.env.VITE_API_ROOT ?? '';

function bearerDriver(config) {
  const token = localStorage.getItem('driver_access_token');
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
httpAuth.interceptors.request.use(bearerDriver);

export const http = axios.create({
  baseURL: root,
  headers: { 'Content-Type': 'application/json' },
});
http.interceptors.request.use(bearerDriver);

export const auth = {
  loginWithTelegram: (init_data) =>
    httpAuthPublic.post('/auth/telegram-webapp-login', { init_data }).then((r) => r.data),

  loginWithPhone: (phone_number, password) =>
    httpAuthPublic.post('/auth/login', { phone_number, password }).then((r) => r.data),

  requestPasswordReset: (phone_number) =>
    httpAuthPublic.post('/auth/reset-phone', { phone_number }).then((r) => r.data),

  verifyPasswordResetCode: (code) =>
    httpAuth.post('/auth/verify-reset-code', { code }).then((r) => r.data),

  completePasswordReset: (new_password, confirm_password) =>
    httpAuth.post('/auth/reset-password', { new_password, confirm_password }).then((r) => r.data),

  me: () => httpAuth.get('/auth/me').then((r) => r.data),
  refresh: (refresh_token) => httpAuth.post('/auth/refresh', { refresh_token }).then((r) => r.data),
};

export const driverProfile = {
  create: (data) => http.post('/drivers/profile', data).then((r) => r.data),
  me: () => http.get('/drivers/me').then((r) => r.data),
  update: (data) => http.patch('/drivers/me', data).then((r) => r.data),
};

export const truckTypes = {
  list: () => http.get('/drivers/truck-types').then((r) => r.data),
};

export const announcements = {
  list: (params = {}) => http.get('/drivers/announcements', { params }).then((r) => r.data),
  create: (data) => http.post('/drivers/announcements', data).then((r) => r.data),
  get: (id) => http.get(`/drivers/announcements/${id}`).then((r) => r.data),
  offers: (announcementId) =>
    http.get(`/drivers/announcements/${announcementId}/offers`).then((r) => r.data),
};

export const loads = {
  list: (params = {}) => http.get('/orders/', { params }).then((r) => r.data).catch(() => []),
  get: (id) => http.get(`/orders/${id}`).then((r) => r.data).catch(() => null),
};

export const offers = {
  create: (loadId, data) => http.post(`/orders/${loadId}/offers`, data).then((r) => r.data),
  listByOrder: (loadId) => http.get(`/orders/${loadId}/offers`).then((r) => r.data),
  update: (offerId, data) => http.patch(`/orders/offers/${offerId}`, data).then((r) => r.data),
};

export const ai = {
  usage: () => http.get('/ai/me/usage').then((r) => r.data),
  wsInfo: () => http.get('/ai/ws-info').then((r) => r.data),
  chats: () => http.get('/ai/chats').then((r) => r.data),
  createChat: (data) => http.post('/ai/chats', data).then((r) => r.data),
  chatDetail: (chatId) => http.get(`/ai/chats/${chatId}`).then((r) => r.data),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return http
      .post('/ai/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
  rate: (data) => http.post('/ai/ratings', data).then((r) => r.data),
};

export const trips = {
  active: (driverId) =>
    loads
      .list({ driver_id: driverId })
      .then((items) =>
        (items || []).find((o) => ['accepted', 'in_progress'].includes(String(o?.status || '')))
      ),
};
