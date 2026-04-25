<script setup>
import Home from '../components/Home.vue'
import PageShell from '../components/layout/PageShell.vue'
</script>

<template>
  <PageShell width="default">
    <template #header>
      <section class="page-hero">
        <p class="page-eyebrow">Inicio</p>
        <h1 class="page-title">Bienvenido a la Aplicacion de Canciones</h1>
        <p class="page-intro">
          Esta aplicación te permite descubrir, buscar y reproducir tus canciones
          favoritas. Explora las canciones más populares, encuentra canciones por su
          título, o déjanos elegir una canción al azar para ti.
        </p>
      </section>
    </template>

    <Home />
  </PageShell>
</template>
