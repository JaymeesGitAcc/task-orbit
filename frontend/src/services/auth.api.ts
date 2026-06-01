import API from "./api"

export const loginUser = (data: { email: string; password: string }) =>
  API.post("api/auth/login", data)

export const signupUser = (data: {
  name: string
  email: string
  password: string
}) => API.post("/api/auth", data)

export const verifyEmail = (token: string) =>
  API.post("/api/auth/verify-email", { token })

export const passwordResetLink = (email: string) =>
  API.post("/api/auth/forgot-password", { email })

export const resetPassword = ({
  token,
  password,
}: {
  token: string
  password: string
}) => API.post(`/api/auth/reset-password/${token}`, { password })

export const updatePassword = (data: {
  currentPassword: string
  newPassword: string
}) => API.patch("/api/auth/update-password", data)
