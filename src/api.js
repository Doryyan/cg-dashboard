import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://39.106.98.184/api/v1'

const api = axios.create({ baseURL: API_BASE, timeout: 30000 })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.reload()
  }
  return Promise.reject(err)
})

export const login = (email, password) => api.post('/admin/login', { email, password })
export const getDashboard = () => api.get('/admin/dashboard')
export const getUsers = (page = 1) => api.get('/admin/users', { params: { page } })
export const getRevenue = () => api.get('/admin/revenue')
export const getAIUsage = () => api.get('/admin/ai-usage')
export default api
