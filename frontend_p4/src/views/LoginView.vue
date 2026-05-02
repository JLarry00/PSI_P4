<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 
import { backendUrl } from '@/utils/backendUrl'

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    const response = await fetch(backendUrl('/api/v1/token/login/'), { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    if (!response.ok) {
      throw new Error('Credenciales incorrectas')
    }

    const data = await response.json()

    // Djoser devuelve { auth_token: '...' }
    authStore.setToken(data.auth_token) 
    
    // Si quieres obtener datos del usuario, podrías hacer otra petición a /api/v1/users/me/
    // const userResponse = await fetch(backendUrl('/api/v1/users/me/'), { ... })

    router.push('/')

  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    alert('Fallo en la autenticación. Por favor, revisa tus credenciales.')
  }
}
</script>

<template>
  <main class="login-wrapper">
    <div class="login-card" style="text-align: center; margin-top: 50px;">
      <h1>INICIO DE SESIÓN</h1>
      <form @submit.prevent="handleLogin" style="display: inline-flex; flex-direction: column; gap: 10px;">
        <input 
          type="text" 
          v-model="username" 
          placeholder="username" 
          required 
        />
        <input 
          type="password" 
          v-model="password" 
          placeholder="password" 
          required 
        />
        <button type="submit" style="background-color: #007bff; color: white; padding: 10px; border: none; cursor: pointer;">
          INICIAR SESIÓN
        </button>
      </form>
    </div>
  </main>
</template>
