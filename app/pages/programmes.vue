<script setup lang="ts">
useSeoMeta({
  title: 'Programmes & Ressources',
  description: 'Programmes de mentorat, bourses, communautés et opportunités pour les développeuses en France.',
  ogTitle: 'Programmes & Ressources — OSLD',
  ogDescription: 'Programmes de mentorat, bourses, communautés et opportunités pour les développeuses en France.',
})

interface Program {
  id: number
  name: string
  description: string
  category: 'mentoring' | 'community' | 'funding' | 'conference'
  url: string
  highlight: boolean
}

const { data: programs, status } = await useFetch<Program[]>('/api/programs')

const categories = [
  { key: 'all', label: 'Tous' },
  { key: 'community', label: 'Communautés' },
  { key: 'mentoring', label: 'Mentorat' },
  { key: 'conference', label: 'Conférences' },
  { key: 'funding', label: 'Formations' }
]

const categoryLabels: Record<string, string> = {
  community: 'Communauté',
  mentoring: 'Mentorat',
  conference: 'Conférence',
  funding: 'Formation'
}

const activeCategory = ref('all')

const filteredPrograms = computed(() => {
  if (!programs.value) return []
  if (activeCategory.value === 'all') return programs.value
  return programs.value.filter(p => p.category === activeCategory.value)
})
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 md:px-16 py-16 md:py-24">
    <div class="mb-16">
      <span class="block text-[0.7rem] uppercase tracking-[0.2em] text-foreground-muted mb-4">Ressources</span>
      <h1 class="font-display text-4xl md:text-6xl font-medium tracking-tight mb-6">
        Programmes & Communautés
      </h1>
      <p class="text-foreground-muted text-lg max-w-2xl leading-relaxed">
        Mentorat, formations, communautés et conférences pour les développeuses. On a fait le tri pour toi.
      </p>
    </div>

    <div class="flex flex-wrap gap-3 mb-12">
      <button
        v-for="cat in categories"
        :key="cat.key"
        @click="activeCategory = cat.key"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          activeCategory === cat.key
            ? 'bg-foreground text-background'
            : 'border border-border hover:border-foreground-muted'
        ]"
      >
        {{ cat.label }}
      </button>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="filteredPrograms.length === 0" class="text-center py-12 text-foreground-muted border border-border rounded-2xl">
      Aucun programme dans cette catégorie.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <a
        v-for="program in filteredPrograms"
        :key="program.id"
        :href="program.url"
        target="_blank"
        rel="noopener noreferrer"
        :class="[
          'group p-6 border rounded-2xl transition-all hover:border-foreground-muted no-underline',
          program.highlight ? 'border-primary/50 bg-primary/5' : 'border-border'
        ]"
      >
        <div class="flex items-start justify-between gap-4 mb-4">
          <h2 class="font-display text-xl font-medium group-hover:text-foreground transition-colors">
            {{ program.name }}
          </h2>
          <svg class="w-5 h-5 text-foreground-muted opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
        <p class="text-foreground-muted text-sm leading-relaxed mb-4">
          {{ program.description }}
        </p>
        <span class="inline-block px-3 py-1 text-xs border border-border rounded-full text-foreground-muted">
          {{ categoryLabels[program.category] }}
        </span>
      </a>
    </div>

    <div class="mt-24 p-8 md:p-12 border border-border rounded-2xl text-center">
      <h2 class="font-display text-2xl md:text-3xl font-medium mb-4">
        Un programme à suggérer ?
      </h2>
      <p class="text-foreground-muted mb-6 max-w-md mx-auto">
        Tu connais un programme, une communauté ou une conférence qui devrait être listée ici ?
      </p>
      <a
        href="mailto:contact@ousontlesdeveloppeuses.fr?subject=Suggestion de programme"
        class="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium no-underline hover:bg-foreground-muted transition-colors"
      >
        <span>Proposer un programme</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </div>
</template>
