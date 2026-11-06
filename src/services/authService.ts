import { apiRequest } from "@/lib/api";

export type AuthResponse = { id: number; name: string; email: string; role: string; token: string };

export const authService = {
  login: (email: string, password: string) => apiRequest<AuthResponse>("/users/login", { method: "POST", body: { email, password } }),
  register: (name: string, email: string, password: string) => apiRequest<AuthResponse>("/users/register", { method: "POST", body: { name, email, password } }),
  remove: (id: number, token: string) => apiRequest<{ message: string }>(`/users/${id}`, { method: "DELETE", token }),
};
