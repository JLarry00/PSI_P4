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
const coverUrl = computed(() => backendUrl(song.value?.background_image ?? ''))

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

function emitTimeUpdate(t) {
  currentTime.value = t
}

function emitEnded() {
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
        correct_guesses: correct,
        wrong_guesses: wrong
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
          v-if="coverUrl"
          :src="coverUrl"
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
        @on-time-update="emitTimeUpdate"
        @on-ended="emitEnded"
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
