const configuredUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export const API_BASE_URL = configuredUrl.replace(/\/+$/, "").replace(/\/api$/, "") + "/api";

export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }

export async function apiRequest<T>(path: string, options: { method?: "GET" | "POST" | "DELETE"; body?: unknown; signal?: AbortSignal; token?: string | null } = {}): Promise<T> {
  const headers = new Headers();
  if (options.body) headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { method: options.method ?? "GET", headers, body: options.body ? JSON.stringify(options.body) : undefined, cache: "no-store", signal: options.signal });
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) throw new ApiError(response.status, "A API retornou um formato inválido.");
  const body = await response.json();
  if (!response.ok) throw new ApiError(response.status, body?.message ?? "Erro ao se comunicar com a API.");
  return body as T;
}
