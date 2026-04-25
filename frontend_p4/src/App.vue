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
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  background: var(--app-bg);
}

.side-menu {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 2rem 1.25rem;
  border-right: 1px solid var(--panel-border);
  background: var(--panel-bg);
  color: #fafaf9;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.03);
}

.brand-block {
  margin-bottom: 2rem;
}

.brand-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fdba74;
}

.brand-block h1 {
  margin: 0;
  font-size: 1.9rem;
  line-height: 1.05;
  color: #fffaf5;
}

.brand-copy {
  margin: 0.9rem 0 0;
  line-height: 1.6;
  color: #e7e5e4;
}

.menu-nav {
  display: grid;
  gap: 0.75rem;
}

.menu-link {
  display: block;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(251, 146, 60, 0.2);
  border-radius: 14px;
  color: #fff7ed;
  background: rgba(255, 255, 255, 0.06);
  font-weight: 600;
}

.menu-link:hover {
  background: rgba(251, 146, 60, 0.16);
  border-color: rgba(251, 146, 60, 0.35);
}

.menu-link.router-link-exact-active {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  border-color: transparent;
  color: #ffffff;
}

.view-panel {
  min-width: 0;
  min-height: 100vh;
  padding: 0;
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .side-menu {
    position: relative;
    height: auto;
    padding: 1.25rem;
    border-right: 0;
    border-bottom: 1px solid var(--panel-border);
  }

  .menu-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .menu-nav {
    grid-template-columns: 1fr;
  }
}
</style>
