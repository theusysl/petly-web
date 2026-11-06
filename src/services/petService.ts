import { apiRequest } from "@/lib/api";

export type ApiPet = { id: number; name: string; species: string; breed?: string | null; age?: number | null; description?: string | null; photoUrl?: string | null; latitude?: number | null; longitude?: number | null; status: string; ownerId: number };
export type CreatePetPayload = { name: string; species: string; breed?: string; age?: number; description?: string; status: "AVAILABLE" | "LOST" | "FOUND"; photoUrl?: string };

export const petService = {
  list: (signal?: AbortSignal) => apiRequest<ApiPet[]>("/pets", { signal }),
  getById: (id: string, signal?: AbortSignal) => apiRequest<ApiPet>(`/pets/${id}`, { signal }),
  create: (payload: CreatePetPayload, token: string) => apiRequest<ApiPet>("/pets", { method: "POST", body: payload, token }),
  remove: (id: string, token: string) => apiRequest<{ message: string }>(`/pets/${id}`, { method: "DELETE", token }),
};
