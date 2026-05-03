import { create } from "zustand"
import { persist } from "zustand/middleware"
import { loginUser } from "@/services/auth.api"

type User = {
  _id: string
  name: string
  email: string
}

type AuthState = {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
  login: (
    data: { email: string; password: string },
    cb?: () => void,
  ) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (credentials, cb) => {
        try {
          set({ loading: true, error: null })

          const res = await loginUser(credentials)

          const { token, user } = res.data.data

          set({
            token,
            user,
            loading: false,
          })
          cb?.()
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "Login failed",
            loading: false,
          })
        }
      },

      logout: () => {
        set({ user: null, token: null })
        useAuthStore.persist.clearStorage()
      },
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
)
