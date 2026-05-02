import API from "./api"

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/auth/login", data)

export const signupUser = (data: {
  name: string
  email: string
  password: string
}) => API.post("/auth/signup", data)
