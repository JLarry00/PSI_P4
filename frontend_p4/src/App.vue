<script setup>
import { RouterLink, RouterView } from 'vue-router'

const menuItems = [
  { to: '/', label: 'Inicio' },
  { to: '/faq', label: 'FAQ' },
  { to: '/log-in', label: 'Iniciar sesion' },
  { to: '/log-out', label: 'Cerrar sesion' },
]
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
