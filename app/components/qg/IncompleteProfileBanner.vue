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
  <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
    <div class="flex items-start gap-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-400 shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div>
        <p class="text-sm text-foreground font-medium mb-1">Profil incomplet</p>
        <p class="text-xs text-foreground-muted mb-3">
          Pour accéder {{ context }}, il te manque : <span class="text-amber-400">{{ missingFields.join(', ') }}</span>
        </p>
        <button
          @click="emit('goToProfile')"
          class="text-xs text-amber-400 hover:text-amber-300 underline transition-colors"
        >
          Compléter mon profil
        </button>
      </div>
    </div>
  </div>
</template>
