<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { backendUrl } from '@/utils/backendUrl.js'

const props = defineProps({
  song: { type: Object, default: null },
  onTimeUpdate: { type: Number, default: 0 },
  playbackEnded: { type: Boolean, default: false }
})

const emit = defineEmits(['stopAudio', 'startAudio', 'summary'])

const lrcLines = ref([])
const lrcText = ref('')
const loadError = ref('')
const blankInput = ref('')
const skippedLines = ref(new Set())
const correctCount = ref(0)
const wrongCount = ref(0)
const summaryShown = ref(false)
const activeBlankLineIndex = ref(-1)
const lineSolved = ref(new Set())

function normalizeWord(s) {
  return s.trim().toLowerCase()
}

function parseLrcTimestamp(line) {
  const m = line.match(/^\[(\d+):(\d+)\.(\d+)\]\s*(.*)$/)
  if (!m) return null
  const min = Number(m[1])
  const sec = Number(m[2])
  const seconds = min * 60 + sec + parseFloat('0.' + m[3])
  const rest = m[4]
  const bm = rest.match(/^(.*)\{([^}]+)\}(.*)$/)
  if (bm) {
    return {
      time: seconds,
      before: bm[1],
      blank: bm[2],
      after: bm[3],
      full: `${bm[1]}${bm[2]}${bm[3]}`
    }
  }
  return { time: seconds, before: rest, blank: null, after: '', full: rest }
}

function parseLrc(text) {
  const out = []
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || /^\[[a-zA-Z]+:/.test(line)) continue
    const parsed = parseLrcTimestamp(line)
    if (parsed) out.push(parsed)
  }
  out.sort((a, b) => a.time - b.time)
  return out
}

const currentIndex = computed(() => {
  const lines = lrcLines.value
  const t = props.onTimeUpdate
  let idx = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= t) idx = i
    else break
  }
  return idx
})

const visibleSlice = computed(() => {
  const lines = lrcLines.value
  const i = currentIndex.value
  if (i < 0 || !lines.length) return { prev: null, curr: null, next: null, indices: [-1, -1, -1] }
  const prev = i > 0 ? { line: lines[i - 1], index: i - 1 } : null
  const curr = { line: lines[i], index: i }
  const next = i < lines.length - 1 ? { line: lines[i + 1], index: i + 1 } : null
  return { prev, curr, next, indices: [prev?.index ?? -1, i, next?.index ?? -1] }
})

const nextLineTime = computed(() => {
  const i = currentIndex.value
  const lines = lrcLines.value
  if (i < 0 || i >= lines.length - 1) return Infinity
  return lines[i + 1].time
})

watch(currentIndex, (ci) => {
  const lines = lrcLines.value
  if (ci < 0 || !lines[ci]) {
    activeBlankLineIndex.value = -1
    blankInput.value = ''
    return
  }
  
  // Bloqueo: No avanzar el activeBlankLineIndex si hay una palabra pendiente sin resolver
  const active = activeBlankLineIndex.value
  if (active !== -1 && !lineSolved.value.has(active) && !skippedLines.value.has(active)) {
    return 
  }

  const line = lines[ci]
  if (line.blank && !lineSolved.value.has(ci) && !skippedLines.value.has(ci)) {
    activeBlankLineIndex.value = ci
    blankInput.value = ''
  } else {
    activeBlankLineIndex.value = -1
    blankInput.value = ''
  }
})

function isPrefixOk(typed, expected) {
  const a = normalizeWord(typed)
  const b = normalizeWord(expected)
  if (!a.length) return true
  return b.startsWith(a)
}

function onBlankInput() {
  const idx = activeBlankLineIndex.value
  const lines = lrcLines.value
  if (idx < 0 || !lines[idx]?.blank) return
  const expected = lines[idx].blank
  const val = blankInput.value

  if (!isPrefixOk(val, expected)) {
    wrongCount.value++
    emit('stopAudio')
    return
  }

  if (normalizeWord(val) === normalizeWord(expected)) {
    lineSolved.value.add(idx)
    correctCount.value++
    activeBlankLineIndex.value = -1
    blankInput.value = ''
    emit('startAudio')
  }
}

function skipBlank() {
  const idx = activeBlankLineIndex.value
  if (idx < 0) return
  wrongCount.value++
  skippedLines.value.add(idx)
  lineSolved.value.add(idx)
  blankInput.value = ''
  activeBlankLineIndex.value = -1
  emit('startAudio')
}

watch(
  () => props.onTimeUpdate,
  (t) => {
    const idx = activeBlankLineIndex.value
    const lines = lrcLines.value
    if (idx < 0 || !lines[idx]?.blank) return
    if (skippedLines.value.has(idx) || lineSolved.value.has(idx)) return
    
    // Opción A: Calcula el tiempo final y aplica un margen de 250ms para cazar el evento
    const end = idx < lines.length - 1 ? lines[idx + 1].time : Infinity
    if (t >= end - 0.25) {
      emit('stopAudio')
    }
  }
)

watch(
  () => props.playbackEnded,
  (ended) => {
    if (!ended || summaryShown.value || !lrcLines.value.length) return
    summaryShown.value = true
    const totalAttempts = correctCount.value + wrongCount.value
    const pct =
      totalAttempts === 0 ? 100 : Math.round((correctCount.value / totalAttempts) * 100)
    emit('summary', {
      correct: correctCount.value,
      wrong: wrongCount.value,
      percentage: pct
    })
  }
)

async function loadLrc() {
  lrcLines.value = []
  loadError.value = ''
  const url = props.song?.lrc_file ?? props.song?.lyricsURL
  if (!url) {
    loadError.value = 'No hay letra (LRC) para esta canción.'
    return
  }
  try {
    const res = await fetch(url.startsWith('http') ? url : backendUrl(url))
    if (!res.ok) throw new Error(String(res.status))
    lrcText.value = await res.text()
    lrcLines.value = parseLrc(lrcText.value)
  } catch (e) {
    loadError.value = 'No se pudo cargar el archivo de letras.'
    console.error(e)
  }
}

onMounted(loadLrc)
watch(
  () => props.song?.id,
  () => {
    summaryShown.value = false
    correctCount.value = 0
    wrongCount.value = 0
    skippedLines.value = new Set()
    lineSolved.value = new Set()
    loadLrc()
  }
)

function displayLine(entry) {
  if (!entry) return ''
  const { line, index } = entry
  const solved = line.blank && (lineSolved.value.has(index) || skippedLines.value.has(index))
  if (!line.blank) return line.full
  if (solved) return line.full
  return `${line.before}_____${line.after}`
}
</script>

<template>
  <section class="lyrics-display">
    <p v-if="loadError" class="error">{{ loadError }}</p>
    <template v-else-if="lrcLines.length">
      <div class="lyrics-window" aria-live="polite">
        <p v-if="visibleSlice.prev" class="line prev">
          {{ displayLine(visibleSlice.prev) }}
        </p>
        <p v-if="visibleSlice.curr" class="line curr">
          <template v-if="visibleSlice.curr.line.blank && activeBlankLineIndex === visibleSlice.curr.index">
            <span>{{ visibleSlice.curr.line.before }}</span>
            <input
              v-model="blankInput"
              class="blank-input"
              type="text"
              autocomplete="off"
              :aria-label="'Palabra omitida'"
              @input="onBlankInput"
            />
            <span>{{ visibleSlice.curr.line.after }}</span>
            <button type="button" class="skip-btn" @click="skipBlank">Skip</button>
          </template>
          <template v-else>
            {{ displayLine(visibleSlice.curr) }}
          </template>
        </p>
        <p v-if="visibleSlice.next" class="line next">
          {{ displayLine(visibleSlice.next) }}
        </p>
      </div>
      <p v-if="playbackEnded && summaryShown" class="summary">
        Fin de la canción: {{ correctCount }} aciertos, {{ wrongCount }} fallos
        ({{ Math.round((correctCount + wrongCount) ? (correctCount / (correctCount + wrongCount)) * 100 : 100) }}% aciertos sobre intentos valorados).
      </p>
    </template>
  </section>
</template>

<style scoped>
.lyrics-display {
  margin-top: 1.5rem;
}
.lyrics-window {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
  min-height: 5rem;
}
.line {
  margin: 0.35rem 0;
  line-height: 1.5;
}
.line.prev,
.line.next {
  color: #64748b;
  font-size: 0.95rem;
}
.line.curr {
  font-weight: 600;
  font-size: 1.05rem;
  color: #0f172a;
}
.blank-input {
  width: 6.5rem;
  margin: 0 0.35rem;
  padding: 0.2rem 0.4rem;
  border: 1px solid #94a3b8;
  border-radius: 6px;
}
.skip-btn {
  margin-left: 0.5rem;
  font-size: 0.85rem;
}
.error {
  color: #b91c1c;
}
.summary {
  margin-top: 1rem;
  font-weight: 500;
}
</style>