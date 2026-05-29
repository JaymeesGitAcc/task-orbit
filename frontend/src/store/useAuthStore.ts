import { create } from "zustand"
import { persist } from "zustand/middleware"
import { loginUser, signupUser } from "@/services/auth.api"

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
  signup: (
    data: { name: string; email: string; password: string },
    cb?: () => void,
  ) => Promise<void>
  login: (
    data: { email: string; password: string },
    cb?: () => void,
  ) => Promise<void>
  logout: (cd?: () => void) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      signup: async (fields, cb) => {
        set({ error: null })
        try {
          await signupUser(fields)
          cb?.()
        } catch (err: any) {
          set({
            error: err.response?.data?.message || "SignUp failed",
          })
        }
      },
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

      logout: (cb) => {
        set({ user: null, token: null })
        useAuthStore.persist.clearStorage()
        cb?.()
      },
    }),
    {
      name: "auth-storage", // localStorage key
    },
  ),
)
