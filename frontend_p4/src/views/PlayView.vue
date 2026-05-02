<script setup>
import { ref, watch, computed } from 'vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import LyricsDisplay from '@/components/LyricsDisplay.vue'
import { backendUrl } from '@/utils/backendUrl.js'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps({
  id: { type: String, required: true }
})

const auth = useAuthStore()
const song = ref(null)
const loading = ref(true)
const error = ref('')
const currentTime = ref(0)
const stopAudio = ref(false)
const resumeTick = ref(0)
const playbackEnded = ref(false)

const detailUrl = computed(() => backendUrl(`/api/v1/songs/${props.id}/`))

async function loadSong() {
  loading.value = true
  error.value = ''
  playbackEnded.value = false
  song.value = null
  try {
    const res = await fetch(detailUrl.value)
    if (!res.ok) throw new Error(await res.text().catch(() => res.status))
    song.value = await res.json()
  } catch (e) {
    console.error(e)
    error.value = 'No se pudo cargar la canción.'
  } finally {
    loading.value = false
  }

  console.log(song.value)
}

watch(() => props.id, loadSong, { immediate: true })

function handleTimeUpdate(t) {
  currentTime.value = t
}

function handleEnded() {
  playbackEnded.value = true
}

function onLyricsStop() {
  stopAudio.value = true
}

function onLyricsStart() {
  stopAudio.value = false
  resumeTick.value++
}

async function onSummary({ correct, wrong }) {
  if (!auth.isAuthenticated || !song.value) return
  try {
    const response = await fetch(backendUrl('/api/v1/songusers/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${auth.token}`
      },
      body: JSON.stringify({
        song: song.value.id,
        correct_answers: correct,
        wrong_answers: wrong
      })
    })

    if (response.status === 401) {
      console.warn('Token expirado o inválido. Cerrando sesión automáticamente.')
      auth.clearSession()
      return
    }

    if (!response.ok) {
      console.error('Error al guardar reproducciones:', await response.text())
      return
    }

    // Reflejamos el cambio en la UI localmente si fue exitoso
    song.value.number_times_played += 1
    
  } catch (e) {
    console.error('SongUser:', e)
  }
}
</script>

<template>
  <main class="play-view">
    <p v-if="loading">Cargando…</p>
    <p v-else-if="error">{{ error }}</p>
    <article v-else-if="song" class="song-play">
      <header class="header">
        <img
          v-if="song.background_image"
          :src="song.background_image"
          alt=""
          class="cover"
        />
        <div>
          <h1>{{ song.title }}</h1>
          <p v-if="song.artist" class="meta">{{ song.artist }}</p>
        </div>
      </header>

      <AudioPlayer
        :song="song"
        :stop-audio="stopAudio"
        :resume-tick="resumeTick"
        @on-time-update="handleTimeUpdate"
        @on-ended="handleEnded"
        @sync-play="stopAudio = false"
        @sync-pause="stopAudio = true"
      />

      <LyricsDisplay
        :song="song"
        :on-time-update="currentTime"
        :playback-ended="playbackEnded"
        @stop-audio="onLyricsStop"
        @start-audio="onLyricsStart"
        @summary="onSummary"
      />
    </article>
  </main>
</template>

<style scoped>
.play-view {
  max-width: 640px;
}
.header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.25rem;
}
.cover {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 12px;
}
.meta {
  color: #64748b;
  margin: 0.25rem 0 0;
}
</style>
















<!-- <script setup>
import { ref, onMounted } from 'vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import LyricsDisplay from '@/components/LyricsDisplay.vue'

const props = defineProps({
  id: { type: String, required: true }
})

const url_global = import.meta.env.VITE_API_BASE_URL || ''
const SONGS_URL = `${url_global.replace(/\/$/, '')}/api/v1/songs/${props.id}`
const songs = ref([])
const isLoading = ref(true)
const errorMessage = ref('')
const currentAudioId = ref(null)

function formatCategory(category) {
  return category ? category.replaceAll('_', ' ') : 'Sin categoria'
}

function handlePlay(songId) {
  currentAudioId.value = songId
}

function handlePause(songId) {
  if (currentAudioId.value === songId) {
    currentAudioId.value = null
  }
}

onMounted(async () => {
  try {
    const response = await fetch(SONGS_URL)
    if (!response.ok) {
      console.error('Error al obtener canciones:', response.status, await response.text().catch(() => ''))
      songs.value = []
      errorMessage.value = 'No se pudieron cargar las canciones.'
      return
    }
    const data = await response.json()
    songs.value = Array.isArray(data.results) ? data.results : []
  } catch (e) {
    console.error('Error de red o CORS al obtener canciones', e)
    songs.value = []
    errorMessage.value = 'Ha ocurrido un error al conectar con el servidor.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="play-view">
    <h1>Canciones</h1>

    <p v-if="isLoading">Cargando canciones...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="songs.length === 0">No hay canciones disponibles.</p>

    <ul v-else class="song-list">
      <li
        v-for="song in songs"
        :key="song.id"
        class="song-card"
      >
        <img
          v-if="song.background_image"
          :src="song.background_image"
          :alt="`Portada de ${song.title}`"
          class="song-cover"
        >

        <div class="song-content">
          <h2>{{ song.title }}</h2>
          <p><strong>Artista:</strong> {{ song.artist }}</p>
          <p><strong>Idioma:</strong> {{ song.language }}</p>
          <p><strong>Categoria:</strong> {{ formatCategory(song.category) }}</p>
          <p><strong>Reproducciones:</strong> {{ song.number_times_played }}</p>

          <audio
            v-if="song.audio_file"
            class="song-audio"
            :src="song.audio_file"
            controls
            preload="none"
            @play="handlePlay(song.id)"
            @pause="handlePause(song.id)"
            @ended="handlePause(song.id)"
          />

          <a
            v-if="song.lrc_file"
            :href="song.lrc_file"
            target="_blank"
            rel="noreferrer"
          >
            Ver archivo LRC
          </a>

          <p v-if="currentAudioId === song.id" class="playing-label">
            Reproduciendo ahora
          </p>
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.play-view {
  display: grid;
  gap: 24px;
}

.song-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 20px;
}

.song-card {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.song-cover {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 14px;
}

.song-content {
  display: grid;
  gap: 10px;
  align-content: start;
}

.song-content h2,
.song-content p {
  margin: 0;
}

.song-audio {
  width: 100%;
  max-width: 420px;
}

.playing-label {
  color: #0f766e;
  font-weight: 600;
}

@media (max-width: 720px) {
  .song-card {
    grid-template-columns: 1fr;
  }

  .song-cover {
    max-width: 220px;
  }
}
</style> -->
