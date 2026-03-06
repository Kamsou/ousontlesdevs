<script setup lang="ts">
defineProps<{
  missingFields: string[]
  context: string
}>()

const emit = defineEmits<{
  goToProfile: []
}>()
</script>

<template>
  <div class="p-5 bg-amber-500/[0.06] border-l-4 border-l-amber-500 border border-amber-500/15 rounded-2xl">
    <div class="flex items-start gap-4">
      <div class="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-700 dark:text-amber-400">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <p class="text-sm text-foreground font-bold mb-1">Profil incomplet</p>
        <p class="text-xs text-foreground-muted mb-3 leading-relaxed">
          Pour accéder {{ context }}, il te manque : <span class="text-amber-700 dark:text-amber-400 font-medium">{{ missingFields.join(', ') }}</span>
        </p>
        <button
          @click="emit('goToProfile')"
          class="text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors underline underline-offset-2"
        >
          Compléter mon profil
        </button>
      </div>
    </div>
  </div>
</template>
