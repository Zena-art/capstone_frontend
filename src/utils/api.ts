import axios from 'axios'
// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)
// Add response interceptor
api.interceptors.response.use(
  // Handle successful responses
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.status, error.response.data)
      if (error.response.status === 401) {
        console.log('Unauthorized, redirecting to login...')
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      // Handle other response errors
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Error setting up request:', error.message)
    }
    return Promise.reject(error)
  }
)

export default api