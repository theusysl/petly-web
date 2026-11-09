import { apiRequest } from "@/lib/api";

export type CreateReportPayload = { description: string; photoUrl?: string; videoUrl?: string; latitude?: number; longitude?: number };
export type ApiReport = { id: number; description: string; status: "OPEN" | "IN_PROGRESS" | "RESOLVED"; createdAt: string; reporterId?: number | null };

export const reportService = {
  create: (payload: CreateReportPayload, token?: string) => apiRequest("/reports", { method: "POST", body: payload, token }),
  list: (token: string, signal?: AbortSignal) => apiRequest<ApiReport[]>("/reports", { token, signal }),
  updateStatus: (id: number, status: ApiReport["status"], token: string) => apiRequest<ApiReport>(`/reports/${id}`, { method: "PATCH", body: { status }, token }),
};
