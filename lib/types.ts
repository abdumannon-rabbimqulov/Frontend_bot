export type Role = "sender" | "driver" | "admin" | "guest";

export type NextStep = "select_role" | "fill_driver_profile" | "done";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  role?: Role;
  next_step?: NextStep;
}

export interface User {
  id: number;
  user_id?: number;
  full_name?: string;
  phone_number?: string;
  role?: Role;
  balance?: string;
  is_active?: boolean;
}

export interface Order {
  id: number;
  cargo_name: string;
  status: string;
  price: string;
  currency: string;
  customer_id: number;
  driver_id?: number | null;
  waypoints?: Array<{ city: string; address?: string }>;
}
