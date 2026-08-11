"use client";

import { API_URL } from "./site";

const TOKEN_KEY = "hitech_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    // Read the server's own message first — it's almost always the useful one
    // (e.g. "Invalid email or password" on a failed sign-in).
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      /* keep default */
    }
    if (res.status === 401) {
      // Only a *previously signed-in* session can expire. A 401 with no token
      // is just a bad login, so don't confuse the two.
      if (token) {
        setToken(null);
        throw new ApiError(401, "Session expired — please log in again");
      }
      throw new ApiError(401, detail);
    }
    if (res.status === 429) {
      throw new ApiError(429, "Too many attempts — please wait a minute and try again.");
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<void> {
  const data = await api<{ access_token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
}

export async function uploadImage(file: File, kind: "photo" | "logo"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("kind", kind);
  const data = await api<{ url: string }>("/api/uploads", { method: "POST", body: form });
  return data.url;
}
