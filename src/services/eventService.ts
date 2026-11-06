import { apiRequest } from "@/lib/api";

export type ApiEvent = { id: number; title: string; description: string; date: string; location: string; address?: string | null; photoUrl?: string | null; latitude?: number | null; longitude?: number | null; status: string; organizer?: { id: number; name: string; role: string } };
export type CreateEventPayload = { title: string; description: string; date: string; location: string; address?: string; photoUrl?: string; latitude?: number; longitude?: number };

export const eventService = {
  list: (signal?: AbortSignal) => apiRequest<ApiEvent[]>("/events", { signal }),
  getById: (id: string, signal?: AbortSignal) => apiRequest<ApiEvent>(`/events/${id}`, { signal }),
  create: (payload: CreateEventPayload, token: string) => apiRequest<ApiEvent>("/events", { method: "POST", body: payload, token }),
};
