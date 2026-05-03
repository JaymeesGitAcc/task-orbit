import { useAuthStore } from "@/store/useAuthStore"
import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:5000/api",
})

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  },
)

export default API
