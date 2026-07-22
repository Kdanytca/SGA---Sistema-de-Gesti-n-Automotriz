import { defineStore } from 'pinia'
import api from '../api'

let logoutTimer = null

const getStoredToken = () => sessionStorage.getItem('token') || localStorage.getItem('token')

const clearStoredToken = () => {
    sessionStorage.removeItem('token')
    localStorage.removeItem('token')
}

const getTokenExpiration = (token) => {
    try {
        const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
        const payload = JSON.parse(atob(payloadBase64))
        return payload.exp ? payload.exp * 1000 : null
    } catch (error) {
        return null
    }
}

const clearLogoutTimer = () => {
    if (logoutTimer) {
        clearTimeout(logoutTimer)
        logoutTimer = null
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: getStoredToken(),
    }),

    actions: {
        async login(email, password, remember = false) {
            try {
                const response = await api.post('/auth/login', { email, password })
                this.user = response.data.user
                this.token = response.data.token
                clearStoredToken()

                if (remember) {
                    localStorage.setItem('token', response.data.token)
                } else {
                    sessionStorage.setItem('token', response.data.token)
                }

                this.scheduleLogout()

                return response
            } catch (error) {
                throw error
            }
        },

        refreshTokenState() {
            const token = getStoredToken()

            if (!token) {
                this.token = null
                return null
            }

            const expiresAt = getTokenExpiration(token)
            if (expiresAt && expiresAt <= Date.now()) {
                this.logout()
                return null
            }

            this.token = token
            this.scheduleLogout()
            return token
        },

        scheduleLogout() {
            clearLogoutTimer()

            const expiresAt = getTokenExpiration(this.token)
            if (!expiresAt) return

            logoutTimer = setTimeout(() => {
                this.logout()

                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
            }, expiresAt - Date.now())
        },

        logout() {
            this.user = null
            this.token = null
            clearLogoutTimer()
            clearStoredToken()
        },

        async getProfile() {
            try {
                const response = await api.get('/auth/profile')
                this.user = response.data
                return response
            } catch (error) {
                throw error
            }
        },
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.rol === 'admin',
    },
})
