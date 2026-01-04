import axios from 'axios'
import useAuthStore from '../store/useAuthStore'
import { API_URL } from '../config/api'

const api = axios.create({
  baseURL: `${API_URL}/api`,
})

// 請求攔截器：自動加入 token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 回應攔截器：處理 401 未授權
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

