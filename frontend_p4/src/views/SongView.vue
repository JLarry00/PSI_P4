<script setup>
import PageShell from '../components/layout/PageShell.vue'

defineProps({
  id: {
    type: [String, Number],
    default: ''
  }
})
</script>

<template>
  <PageShell width="wide">
    <template #header>
      <section class="page-hero">
        <p class="page-eyebrow">Cancion</p>
        <h1 class="page-title">Reproduccion y letra</h1>
        <p class="page-intro">
          Esta vista albergará la reproducción de la canción y la interacción para
          completar las palabras que faltan en la letra.
        </p>
      </section>
    </template>

    <section class="surface-card">
      <p v-if="id">Preparando la canción con identificador {{ id }}.</p>
      <p v-else>Selecciona una canción desde la página principal para reproducirla.</p>
    </section>
  </PageShell>
</template>
