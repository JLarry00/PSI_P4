import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || null)
  const songUser = ref(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  // Actualización tras el Login
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  const setSongUser = (userData) => {
    songUser.value = userData
  }

  // Limpiar sesión tras el Logout
  const clearSession = () => {
    token.value = null
    songUser.value = null
    localStorage.removeItem('auth_token')
  }

  // Reutilización para las vistas 
  return { token, songUser, isAuthenticated, setToken, setSongUser, clearSession }
})