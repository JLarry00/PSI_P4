<template>
  <main>
    <form @submit.prevent="logIn">
      <div>
        <label for="username">Usuario</label>
        <input id="username" v-model="username" type="text" autocomplete="username" required />
      </div>
      <div>
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>
      <button type="submit" :disabled="loading">{{ loading ? 'Enviando…' : 'Iniciar sesión' }}</button>
      <p v-if="message">{{ message }}</p>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue'

/**
 * URL del endpoint de login (ejemplo para djoser en songproject).
 * Cámbiala si tu `urls.py` usa otra ruta o despliegas en otro dominio.
 */
const LOGIN_API_URL = '/api/v1/token/login/'

function backendUrl(path) {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

const username = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')

async function logIn() {
  message.value = ""
  loading.value = true

  try {
    const response = await fetch(backendUrl(LOGIN_API_URL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      message.value = err?.non_field_errors?.[0] || err?.detail || 'Error de inicio de sesión'
    } else {
      const data = await response.json()
      // Almacena el token para futuras peticiones, ej. en localStorage
      if (data.auth_token) {
        localStorage.setItem('auth_token', data.auth_token)
        console.log(data.auth_token)
        message.value = "Sesión iniciada correctamente"
        // Aquí podrías redireccionar o actualizar el estado global de login si tu app lo requiere
      } else {
        message.value = 'Token no recibido del servidor'
      }
    }
  } catch (e) {
    message.value = 'Error de red o servidor'
  } finally {
    loading.value = false
  }
}
</script>