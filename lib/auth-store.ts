import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DEMO_USERS } from "./mock-data"

interface AuthState {
  token: string | null
  role: "HR_ADMIN" | "MANAGER" | "EMPLOYEE" | null
  userId: string | null
  userName: string | null
  userEmail: string | null
  setAuth: (token: string, role: string, userId: string, userName?: string, userEmail?: string) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
  switchDemoUser: (userType: keyof typeof DEMO_USERS) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      role: null,
      userId: null,
      userName: null,
      userEmail: null,
      setAuth: (token, role, userId, userName, userEmail) =>
        set({ token, role: role as any, userId, userName, userEmail }),
      clearAuth: () => set({ token: null, role: null, userId: null, userName: null, userEmail: null }),
      isAuthenticated: () => !!get().token,
      switchDemoUser: (userType) => {
        const demoUser = DEMO_USERS[userType]
        set({
          token: `demo-token-${userType}`,
          role: demoUser.role,
          userId: demoUser.id,
          userName: demoUser.name,
          userEmail: demoUser.email,
        })
      },
    }),
    {
      name: "auth-store",
    },
  ),
)
