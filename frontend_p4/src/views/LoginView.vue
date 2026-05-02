<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' 

const username = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    // Realizar la petición POST a la API REST
    // Reemplaza la URL por el endpoint real de la API
    const response = await fetch('http://localhost:8000/api/login/', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    // Error
    if (!response.ok) {
      throw new Error('Credenciales incorrectas')
    }

    // Conversion a JSON
    const data = await response.json()

    // Almacenar y comprobar el token devuelto por la API
    authStore.setToken(data.token) 
    // authStore.setSongUser(data.user)

    // Redirigir a la página principal
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
      <h1>INICIo DE SESIÓN</h1>
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
          placeholder="Password" 
          required 
        />
        <button type="submit" style="background-color: #007bff; color: white; padding: 10px; border: none; cursor: pointer;">
          INICIAR DE SESIÓN
        </button>
      </form>
    </div>
  </main>
</template>