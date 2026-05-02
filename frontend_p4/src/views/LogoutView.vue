<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  authStore.logout()
  await fetch('tu-api-url/logout', { method: 'POST', ... })

  setTimeout(() => {
    router.push('/')
  }, 5000)
})
</script>

<template>
  <main class="logout-wrapper">
    <div style="text-align: center; margin-top: 50px;">
      <h1>Sesión cerrada correctamente</h1>
      <p>Serás redirigido a la página principal en 5 segundos</p>
    </div>
  </main>
</template>
