<script setup>
import { useSlots } from 'vue'

defineProps({
  width: {
    type: String,
    default: 'default',
    validator: (value) => ['narrow', 'default', 'wide'].includes(value)
  }
})

const slots = useSlots()
</script>

<template>
  <main class="page-shell">
    <div class="page-shell__inner" :class="`page-shell__inner--${width}`">
      <header v-if="slots.header" class="page-shell__header">
        <slot name="header" />
      </header>

      <div class="page-shell__body">
        <slot />
      </div>
    </div>
  </main>
</template>

<style scoped>
.page-shell {
  width: 100%;
  min-width: 0;
  padding: var(--page-pad-y) var(--page-pad-x) calc(var(--page-pad-y) + 1.5rem);
}

.page-shell__inner {
  width: 100%;
  min-width: 0;
}

.page-shell__inner--narrow {
  max-width: var(--page-max-narrow);
}

.page-shell__inner--default {
  max-width: var(--page-max-default);
}

.page-shell__inner--wide {
  max-width: var(--page-max-wide);
}

.page-shell__header {
  margin-bottom: 2rem;
}

.page-shell__body {
  min-width: 0;
}
</style>
