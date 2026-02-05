<script setup lang="ts">
definePageMeta({
  middleware: 'sidebase-auth',
  layout: 'admin'
})

useSeoMeta({
  title: 'Newsletter - Admin',
  robots: 'noindex'
})

interface Subscriber {
  id: number
  name: string | null
  email: string | null
  emailOptInDate: string | null
}

const { data: subscribers, status } = await useFetch<Subscriber[]>('/api/admin/newsletter')

const copied = ref(false)

async function copyEmails() {
  if (!subscribers.value) return
  const emails = subscribers.value
    .map(s => s.email)
    .filter(Boolean)
    .join(', ')
  await navigator.clipboard.writeText(emails)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function formatDate(date: string | null) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="font-display text-2xl font-medium tracking-tight">Newsletter</h2>
        <p class="text-foreground-muted text-sm mt-1">{{ subscribers?.length || 0 }} inscrit{{ (subscribers?.length || 0) > 1 ? 's' : '' }}</p>
      </div>
      <button
        v-if="subscribers?.length"
        @click="copyEmails"
        class="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground-muted transition-colors flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        {{ copied ? 'Copié !' : 'Copier les e-mails' }}
      </button>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!subscribers?.length" class="text-center py-12 text-foreground-muted border border-border/10 rounded-2xl">
      Aucun inscrit à la newsletter
    </div>

    <div v-else class="border border-border/10 rounded-xl overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-border/10 bg-border/5">
            <th class="text-left py-3 px-4 text-xs uppercase tracking-widest text-foreground-muted font-medium">Nom</th>
            <th class="text-left py-3 px-4 text-xs uppercase tracking-widest text-foreground-muted font-medium">E-mail</th>
            <th class="text-right py-3 px-4 text-xs uppercase tracking-widest text-foreground-muted font-medium">Inscrit le</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sub in subscribers" :key="sub.id" class="border-b border-border/5 last:border-b-0 hover:bg-border/5 transition-colors">
            <td class="py-3 px-4 text-sm">{{ sub.name || '-' }}</td>
            <td class="py-3 px-4 text-sm text-foreground-muted">{{ sub.email }}</td>
            <td class="py-3 px-4 text-sm text-foreground-muted text-right">{{ formatDate(sub.emailOptInDate) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
