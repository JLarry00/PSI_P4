import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const songUser = ref(null)

  // Actualización tras el Login
  const setToken = (newToken) => {
    token.value = newToken
  }

  const setSongUser = (userData) => {
    songUser.value = userData
  }

  // Limpiar sesión tras el Logout
  const clearSession = () => {
    token.value = null
    songUser.value = null
  }

  // Reutilización para las vistas 
  return { token, songUser, setToken, setSongUser, clearSession }
})