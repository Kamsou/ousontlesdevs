<script setup lang="ts">
import type { QgActivity } from '~/types/qg'

defineProps<{
  activity: QgActivity
}>()

const emit = defineEmits<{
  'go-to-profile': []
}>()
</script>

<template>
  <section>
    <div class="flex flex-wrap gap-2">
      <div v-if="activity.weeklyContactsReceived && activity.weeklyContactsReceived > 0" class="px-3 py-2 bg-foreground/[0.05]">
        <span class="text-xs text-foreground-muted uppercase tracking-wide">
          <span class="text-primary">←</span>
          <span class="font-bold text-foreground text-sm tabular-nums">{{ activity.weeklyContactsReceived }}</span>
          {{ activity.weeklyContactsReceived === 1 ? 'message recu' : 'messages recus' }}
        </span>
      </div>

      <div v-if="activity.weeklyContactsSent && activity.weeklyContactsSent > 0" class="px-3 py-2 bg-foreground/[0.05]">
        <span class="text-xs text-foreground-muted uppercase tracking-wide">
          <span class="text-primary">→</span>
          <span class="font-bold text-foreground text-sm tabular-nums">{{ activity.weeklyContactsSent }}</span>
          {{ activity.weeklyContactsSent === 1 ? 'message envoye' : 'messages envoyes' }}
        </span>
      </div>

      <NuxtLink
        v-for="comment in activity.unreadComments"
        :key="`${comment.type}-${comment.id}`"
        :to="comment.type === 'project' ? `/qg/projects/${comment.id}` : `/qg/requests/${comment.id}`"
        class="px-3 py-2 bg-foreground/[0.05] no-underline hover:bg-foreground/[0.08] transition-colors"
      >
        <span class="text-xs text-foreground-muted uppercase tracking-wide">
          <span class="text-primary">●</span>
          <span class="font-bold text-foreground text-sm tabular-nums">{{ comment.count }}</span>
          {{ comment.count === 1 ? 'commentaire' : 'commentaires' }} sur <span class="text-foreground normal-case">{{ comment.title }}</span>
        </span>
      </NuxtLink>

      <div v-if="activity.profileComplete === false" class="px-3 py-2 bg-amber-500/[0.08]">
        <button @click="emit('go-to-profile')" class="text-xs uppercase tracking-wide font-bold hover:text-foreground transition-colors">
          <span class="text-amber-700 dark:text-amber-400">⚠</span>
          <span class="text-amber-700 dark:text-amber-400">Profil incomplet</span>
        </button>
      </div>

      <div v-if="activity.profileComplete" class="px-3 py-2 bg-foreground/[0.03]">
        <span class="text-xs text-foreground-muted uppercase tracking-wide">
          <span class="text-foreground-muted">✓</span> Profil complet
        </span>
      </div>

      <div v-if="activity.communityNewMembers && activity.communityNewMembers > 0" class="px-3 py-2 bg-foreground/[0.03]">
        <span class="text-xs text-foreground-muted uppercase tracking-wide">
          <span class="text-foreground-muted">+</span>
          <span class="font-bold text-foreground-muted tabular-nums">{{ activity.communityNewMembers }}</span>
          {{ activity.communityNewMembers === 1 ? 'nouvelle inscrite' : 'nouvelles inscrites' }}
        </span>
      </div>

      <div v-if="activity.communityHelpRequests && activity.communityHelpRequests > 0" class="px-3 py-2 bg-foreground/[0.03]">
        <span class="text-xs text-foreground-muted uppercase tracking-wide">
          <span class="text-foreground-muted">+</span>
          <span class="font-bold text-foreground-muted tabular-nums">{{ activity.communityHelpRequests }}</span>
          {{ activity.communityHelpRequests === 1 ? 'demande d\'aide' : 'demandes d\'aide' }}
        </span>
      </div>

      <div v-if="activity.communityNewProjects && activity.communityNewProjects > 0" class="px-3 py-2 bg-foreground/[0.03]">
        <span class="text-xs text-foreground-muted uppercase tracking-wide">
          <span class="text-foreground-muted">+</span>
          <span class="font-bold text-foreground-muted tabular-nums">{{ activity.communityNewProjects }}</span>
          {{ activity.communityNewProjects === 1 ? 'nouveau projet' : 'nouveaux projets' }}
        </span>
      </div>
    </div>

    <p v-if="activity.totalHelpGiven && activity.totalHelpGiven > 0" class="text-xs text-foreground-muted mt-3">
      Tu as propose ton aide {{ activity.totalHelpGiven }} fois au total
    </p>
  </section>
</template>
