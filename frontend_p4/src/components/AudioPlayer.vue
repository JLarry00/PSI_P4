<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  song: { type: Object, default: null },
  stopAudio: { type: Boolean, default: false },
  resumeTick: { type: Number, default: 0 }
})

const emit = defineEmits(['onTimeUpdate', 'onEnded'])

const audio = ref(null)

const audioSrc = () => props.song?.audio_file ?? props.song?.audioURL ?? ''

function emitTimeUpdate() {
  const el = audio.value
  if (el) emit('onTimeUpdate', el.currentTime)
}

function emitEnded() {
  emit('onEnded')
}

watch(
  () => props.stopAudio,
  (stop) => {
    const el = audio.value
    if (!el) return
    if (stop) el.pause()
  }
)

watch(
  () => props.resumeTick,
  () => {
    const el = audio.value
    if (!el || props.stopAudio) return
    el.play().catch(() => {})
  }
)
</script>

<template>
  <div v-if="song && audioSrc()" class="audio-player">
    <audio
      ref="audio"
      :src="audioSrc()"
      controls
      preload="metadata"
      @timeupdate="emitTimeUpdate"
      @ended="emitEnded"
    />
  </div>
  <p v-else class="no-audio">No hay audio disponible para esta canción.</p>
</template>

<style scoped>
.audio-player audio {
  width: 100%;
  max-width: 480px;
}
.no-audio {
  color: #64748b;
}
</style>