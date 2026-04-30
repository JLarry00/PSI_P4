import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') ?? '')
  const isAuthenticated = computed(() => Boolean(token.value))

  function setToken(t) {
    token.value = t ?? ''
    if (t) localStorage.setItem('auth_token', t)
    else localStorage.removeItem('auth_token')
  }

  function clearSession() {
    setToken('')
  }

  return { token, isAuthenticated, setToken, clearSession }
})