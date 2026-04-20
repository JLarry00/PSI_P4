<template>
  <div class="home-container">
    <h2>Bienvenido a la Aplicación de Canciones</h2>
    <p>
      Esta aplicación te permite descubrir, buscar y reproducir tus canciones favoritas.
      Explora las canciones más populares, encuentra canciones por su título, o déjanos elegir una canción al azar para ti.
    </p>
    
    <section class="popular-songs">
      <h3>Las 3 Canciones Más Populares</h3>
      <!-- Aquí se mostrarán las canciones más populares obtenidas desde la API -->
      <!-- Falta implementar la obtención de canciones más populares -->
      <ul>
        <!-- Ejemplo de lista (se llenará dinámicamente cuando se implemente la API) -->
      </ul>
    </section>

    <section class="search-section">
      <h3>Buscar Canciones por Título</h3>
      <form @submit.prevent="searchSongs">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Introduce el título de la canción"
        />
        <button type="submit">Buscar</button>
      </form>
      <!-- Aquí se mostrarán los resultados de búsqueda obtenidos desde la API -->
      <ul v-if="searchResults.length">
        <!-- Resultado de búsqueda de canciones irá aquí cuando se implemente la API -->
      </ul>
      <div v-else-if="searchPerformed">No se encontraron canciones.</div>
    </section>

    <section class="random-song">
      <button @click="showRandomSong">Muestrame una canción al azar</button>
      <!-- Aquí se mostrará la sugerencia aleatoria obtenida desde la API -->
      <div v-if="randomSong">
        <!-- Sugerencia de canción aleatoria irá aquí cuando se implemente la API -->
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Aquí se deberá implementar la llamada real a la API para obtener canciones
// Por ahora, dejar la implementación vacía o con mensajes indicando que falta por implementar

const popularSongs = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const searchPerformed = ref(false)
const randomSong = ref(null)
const router = useRouter()

// Falta implementar la obtención de las canciones más populares desde la API
// onMounted(async () => {
//   popularSongs.value = await fetchPopularSongs()
// });

// Falta implementar la búsqueda real de canciones por título
async function searchSongs() {
  // Aquí va la llamada a la API para buscar canciones por el título
  // Falta por implementar
  searchResults.value = []
  searchPerformed.value = true
}

// Falta implementar la obtención real de una canción aleatoria desde la API
async function showRandomSong() {
  // Aquí va la llamada a la API para obtener una canción aleatoria
  // Falta por implementar
  randomSong.value = null
}
</script>

<style scoped>
.home-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
}

.popular-songs ul,
.search-section ul {
  list-style: none;
  padding: 0;
}

.popular-songs li,
.search-section li {
  margin-bottom: 0.5rem;
}

.search-section form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.random-song {
  margin-top: 2rem;
}
</style>