import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // NO redirigir si es una petición de login o register
        const isAuthRequest = error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register')

        // Solo redirigir si no es una petición de autenticación y es 401
        if (error.response?.status === 401 && !isAuthRequest) {
            sessionStorage.removeItem('token')
            localStorage.removeItem('token')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

export default api
