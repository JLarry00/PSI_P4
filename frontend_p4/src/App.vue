<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()

const menuItems = computed(() => {
  const base = [
    { to: '/', label: 'Inicio' },
    { to: '/faq', label: 'FAQ' },
  ]
  if (authStore.isAuthenticated) {
    base.push({ to: '/log-out', label: 'Cerrar sesion' })
  } else {
    base.push({ to: '/log-in', label: 'Iniciar sesion' })
  }
  return base
})
</script>

<template>
  <div class="app-shell">
    <aside class="side-menu">
      <div class="brand-block">
        <p class="brand-kicker">Song Project</p>
        <h1>Lyrics Trainer</h1>
        <p class="brand-copy">
          Navega por la aplicacion y accede rapidamente a sus secciones principales.
        </p>
      </div>

      <nav class="menu-nav" aria-label="Navegacion principal">
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="menu-link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <main class="view-panel">
      <div v-if="authStore.isAuthenticated" class="verified-header">
        <span class="verified-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#007bff">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Usuario Verificado
        </span>
      </div>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}

/* Mantiene el menú lateral a la izquierda */
.side-menu {
  width: 240px;
  padding: 32px 20px 32px 20px;
  border-radius: 0 24px 24px 0;
  margin: 0;
  min-height: 100vh;
  box-shadow: 2px 0 8px 0 rgba(50,50,75,0.06);
  flex-shrink: 0;
  background: #fff;
}

/* Panel derecho para la vista dinámica */
.view-panel {
  flex: 1 1 0%;
  padding: 40px 32px;
  background: #f6f8fa;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative; /* Para posicionar el badge */
}

.verified-header {
  position: absolute;
  top: 20px;
  right: 32px;
  z-index: 10;
}

.verified-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #007bff;
  box-shadow: 0 2px 10px rgba(0, 123, 255, 0.1);
  border: 1px solid rgba(0, 123, 255, 0.2);
}

/* Resto de estilos previos */
.menu-link {
  display: block;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: #fafbfc;
  color: #2c3e50;
  text-decoration: none;
}
</style>
