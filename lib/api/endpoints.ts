"use client";

import { apiClient } from "@/lib/api/client";
import type { AuthTokens, Order, User } from "@/lib/types";

export const authApi = {
  login: (payload: { phone_number?: string; password?: string; init_data?: string }) =>
    apiClient.post<AuthTokens>("/auth/login", payload).then((r) => r.data),
  telegramLogin: (payload: { init_data: string }) =>
    apiClient.post<AuthTokens>("/auth/telegram-webapp-login", payload).then((r) => r.data),
  me: () => apiClient.get<User>("/auth/me").then((r) => r.data),
  updateMe: (payload: Partial<User>) => apiClient.patch<User>("/auth/me", payload).then((r) => r.data),
  logout: () => apiClient.post("/auth/logout").then((r) => r.data),
};

export const senderApi = {
  orders: () => apiClient.get<Order[]>("/orders/").then((r) => r.data),
  createOrder: (payload: any) => apiClient.post("/orders/", payload).then((r) => r.data),
  orderById: (id: string) => apiClient.get(`/orders/${id}`).then((r) => r.data),
  orderOffers: (id: string) => apiClient.get(`/orders/${id}/offers`).then((r) => r.data),
  driverAnnouncements: () => apiClient.get("/drivers/announcements").then((r) => r.data),
  chats: () => apiClient.get("/ai/chats").then((r) => r.data),
};

export const driverApi = {
  profileCreate: (payload: any) => apiClient.post("/drivers/profile", payload).then((r) => r.data),
  me: () => apiClient.get("/drivers/me").then((r) => r.data),
  truckTypes: () => apiClient.get("/drivers/truck-types").then((r) => r.data),
  orders: () => apiClient.get("/orders/").then((r) => r.data),
  announcements: () => apiClient.get("/drivers/announcements").then((r) => r.data),
};

export const adminApi = {
  dashboardStats: () => apiClient.get("/system/dashboard/stats").then((r) => r.data),
  users: () => apiClient.get("/system/users").then((r) => r.data),
  orders: () => apiClient.get("/system/orders").then((r) => r.data),
  truckTypes: () => apiClient.get("/drivers/truck-types").then((r) => r.data),
  aiCommands: () => apiClient.get("/system/ai/commands").then((r) => r.data),
  driverLocations: () => apiClient.get("/system/drivers/locations").then((r) => r.data),
};
