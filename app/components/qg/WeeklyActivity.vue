<script setup lang="ts">
interface Activity {
  isNew: boolean
  weeklyContactsReceived?: number
  weeklyContactsSent?: number
  totalHelpGiven?: number
  profileComplete?: boolean
}

defineProps<{
  activity: Activity
}>()

const emit = defineEmits<{
  'go-to-profile': []
}>()
</script>

<template>
  <section class="mb-12">
    <h2 class="text-lg font-display font-medium mb-4">Cette semaine</h2>
    <div class="flex flex-wrap gap-3">
      <div v-if="activity.weeklyContactsReceived && activity.weeklyContactsReceived > 0" class="flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span class="text-sm text-foreground">
          <span class="font-medium">{{ activity.weeklyContactsReceived }}</span>
          {{ activity.weeklyContactsReceived === 1 ? 'message reçu' : 'messages reçus' }}
        </span>
      </div>

      <div v-if="activity.weeklyContactsSent && activity.weeklyContactsSent > 0" class="flex items-center gap-2 px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-400">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
        <span class="text-sm text-foreground">
          <span class="font-medium">{{ activity.weeklyContactsSent }}</span>
          {{ activity.weeklyContactsSent === 1 ? 'message envoyé' : 'messages envoyés' }}
        </span>
      </div>

      <div v-if="activity.profileComplete === false" class="flex items-center gap-2 px-4 py-2 bg-amber-500/5 border border-amber-500/10 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-400">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <button @click="emit('go-to-profile')" class="text-sm text-foreground hover:text-amber-400 transition-colors">
          Profil incomplet
        </button>
      </div>

      <div v-if="activity.profileComplete" class="flex items-center gap-2 px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-400">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span class="text-sm text-foreground-muted">Profil complet</span>
      </div>

      <div v-if="!activity.weeklyContactsReceived && !activity.weeklyContactsSent" class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-border/20 rounded-full">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-foreground-muted">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span class="text-sm text-foreground-muted">Pas d'échanges cette semaine</span>
      </div>
    </div>

    <p v-if="activity.totalHelpGiven && activity.totalHelpGiven > 0" class="text-xs text-foreground-muted/50 mt-4">
      Tu as proposé ton aide {{ activity.totalHelpGiven }} fois au total
    </p>
  </section>
</template>
