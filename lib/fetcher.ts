import { useAuthStore } from "./auth-store"

export const fetcher = async (url: string, options?: RequestInit) => {
  const token = useAuthStore.getState().token
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    useAuthStore.getState().clearAuth()
    window.location.href = "/login"
    return
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}
