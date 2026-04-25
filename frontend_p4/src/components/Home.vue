<template>
  <div class="home-content">
    <section class="surface-card home-section">
      <h2>Las 3 Canciones Más Populares</h2>
      <ul class="home-list">
        <li v-for="song in popularSongs" :key="song.id">
          <router-link :to="`/songs/${song.id}`" class="song-link">
            {{ song.title }} — Reproducida {{ song.number_times_played }} veces
          </router-link>
        </li>
      </ul>
    </section>

    <section class="surface-card home-section">
      <h2>Buscar Canciones por Título</h2>
      <form class="search-form" @submit.prevent="searchSongs">
        <input
          class="search-input"
          type="text"
          v-model="searchQuery"
          placeholder="Introduce el título de la canción"
        />
        <button class="action-button" type="submit">Buscar</button>
      </form>
      <ul v-if="searchResults.length" class="home-list">
        <li v-for="song in searchResults" :key="song.id">
          <router-link :to="`/songs/${song.id}`" class="song-link">
            {{ song.title }}
          </router-link>
        </li>
      </ul>
      <p v-else-if="searchPerformed" class="helper-text">No se encontraron canciones.</p>
    </section>

    <section class="surface-card home-section">
      <h2>Explorar al azar</h2>
      <p class="helper-text">
        Si no sabes qué escuchar, deja que la aplicación te sugiera una canción.
      </p>
      <button class="action-button" @click="showRandomSong">
        Muestrame una canción al azar
      </button>
      <p v-if="randomSong" class="random-result">
        <router-link :to="`/songs/${randomSong.id}`" class="song-link">
          {{ randomSong.title }}
        </router-link>
      </p>
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
.home-content {
  display: grid;
  gap: 1.25rem;
}

.home-section {
  display: grid;
  gap: 1rem;
}

.home-section h2 {
  font-size: 1.35rem;
}

.home-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.song-link {
  color: var(--accent-strong);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
}

.song-link:hover {
  color: #c2410c;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.search-input {
  flex: 1 1 280px;
  min-height: 44px;
  padding: 0.75rem 0.9rem;
  border: 1px solid #d6d3d1;
  border-radius: 12px;
  background: #ffffff;
  color: var(--text-main);
}

.action-button {
  min-height: 44px;
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.action-button:hover {
  filter: brightness(1.03);
}

.helper-text {
  color: var(--text-soft);
}

.random-result {
  margin: 0;
}
</style>
