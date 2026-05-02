// import { ref, computed } from 'vue'
// import { defineStore } from 'pinia'

// export const useAuthStore = defineStore('auth', () => {
//   const token = ref(localStorage.getItem('auth_token') ?? '')
//   const isAuthenticated = computed(() => Boolean(token.value))

//   function setToken(t) {
//     token.value = t ?? ''
//     if (t) localStorage.setItem('auth_token', t)
//     else localStorage.removeItem('auth_token')
//   }

//   function clearSession() {
//     setToken('')
//   }

//   return { token, isAuthenticated, setToken, clearSession }

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