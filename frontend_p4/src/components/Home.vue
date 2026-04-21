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
        <li v-for="song in popularSongs" :key="song.id">
            <router-link :to="`/songs/${song.id}`">{{ song.title }} — Reproducida {{ song.number_times_played }} veces</router-link>
        </li>
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
        <li v-for="song in searchResults" :key="song.id">
          <router-link :to="`/songs/${song.id}`">{{ song.title }}</router-link>
        </li>
      </ul>
      <div v-else-if="searchPerformed">No se encontraron canciones.</div>
    </section>

    <section class="random-song">
      <button @click="showRandomSong">Muestrame una canción al azar</button>
      <!-- Aquí se mostrará la sugerencia aleatoria obtenida desde la API -->
      <div v-if="randomSong">
        <router-link :to="`/songs/${randomSong.id}`">{{ randomSong.title }}</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

/** Rutas según `links_backend.txt` (songproject.urls). */
const SONGS_TOP_URL = '/api/v1/songs/top/'
const SONGS_SEARCH_URL = '/api/v1/songs/search/'
const SONGS_RANDOM_URL = '/api/v1/songs/random/'

/** Sin VITE_API_BASE_URL: URL relativa → proxy de Vite a Django. */
function backendUrl(path) {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

function normalizeSongList(data) {
  if (Array.isArray(data)) return data
  if (data?.results && Array.isArray(data.results)) return data.results
  if (data?.songs && Array.isArray(data.songs)) return data.songs
  return []
}

const popularSongs = ref([])
const searchQuery = ref('')
const searchResults = ref([])
const searchPerformed = ref(false)
const randomSong = ref(null)

onMounted(async () => {
  try {
    const response = await fetch(backendUrl(SONGS_TOP_URL))
    if (!response.ok) {
      console.error(
        'Top canciones: respuesta HTTP',
        response.status,
        await response.text().catch(() => '')
      )
      return
    }
    const data = await response.json()
    const songs = normalizeSongList(data)
    popularSongs.value = songs.slice(0, 3)
  } catch (e) {
    console.error('Top canciones: error de red o CORS', e)
  }
})

async function searchSongs() {
  const q = searchQuery.value.trim()
  if (!q) {
    searchResults.value = []
    searchPerformed.value = true
    return
  }
  try {
    const params = new URLSearchParams({ title: q })
    const response = await fetch(
      `${backendUrl(SONGS_SEARCH_URL)}?${params.toString()}`
    )
    if (!response.ok) {
      console.error('Búsqueda de canciones: respuesta HTTP', response.status, await response.text().catch(() => ''))
      searchResults.value = []
      searchPerformed.value = true
      return
    }
    const data = await response.json()
    searchResults.value = normalizeSongList(data)
    searchPerformed.value = true
  } catch (e) {
    console.error('Búsqueda de canciones: error de red o CORS', e)
    searchPerformed.value = true
  }
}

async function showRandomSong() {
  try {
    const response = await fetch(backendUrl(SONGS_RANDOM_URL))
    if (!response.ok) {
      console.error('Canción aleatoria: respuesta HTTP', response.status, await response.text().catch(() => ''))
      randomSong.value = null
      return
    }
    randomSong.value = await response.json()
  } catch (e) {
    console.error('Canción aleatoria: error de red o CORS', e)
    randomSong.value = null
  }
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