<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  authStore.clearSession()
  // await fetch('tu-api-url/logout', { method: 'POST' })

  setTimeout(() => {
    router.push('/')
  }, 1000)
})
</script>

<template>
  <div class="logout-blocking-overlay">
    <main class="logout-wrapper">
      <div class="logout-card">
        <div class="spinner"></div>
        <h1>Sesión cerrada correctamente</h1>
        <p>Redirigiendo a Inicio...</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.logout-blocking-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  z-index: 9999; /* Bloquea todo, incluyendo el menú lateral */
  display: flex;
  justify-content: center;
  align-items: center;
}

.logout-card {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
