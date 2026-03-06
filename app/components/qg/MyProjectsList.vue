<script setup lang="ts">
import { statusLabels, statusColors, type SideProjectStatus } from '~/utils/sideProjectStatus'

interface SideProject {
  id: number
  title: string
  status: SideProjectStatus
  techs: string[]
  commentsCount: number
}

const props = defineProps<{
  projects: SideProject[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  'mark-completed': [projectId: number]
}>()

const updatingId = ref<number | null>(null)
const showCompleted = ref(false)

const activeProjects = computed(() =>
  props.projects.filter(p => p.status !== 'completed')
)

const completedProjects = computed(() =>
  props.projects.filter(p => p.status === 'completed')
)

async function markAsCompleted(projectId: number, e: Event) {
  e.preventDefault()
  e.stopPropagation()
  updatingId.value = projectId
  emit('mark-completed', projectId)
  updatingId.value = null
}
</script>

<template>
  <div class="mb-8">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xs font-display font-bold uppercase tracking-wide">Projets</h3>
      <span v-if="activeProjects.length > 0" class="flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 bg-primary rounded-full"></span>
        <span class="text-[11px] text-foreground-muted/30">{{ activeProjects.length }}</span>
      </span>
    </div>

    <div class="divide-y divide-border/20">
      <NuxtLink
        v-for="project in activeProjects"
        :key="project.id"
        :to="`/qg/projects/${project.id}`"
        class="flex items-start gap-3 py-3 first:pt-0 hover:opacity-80 transition-opacity group"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {{ project.title }}
            </span>
            <span :class="['px-1.5 py-0.5 rounded text-[10px] shrink-0', statusColors[project.status]]">
              {{ statusLabels[project.status] }}
            </span>
          </div>
          <div class="flex items-center flex-wrap gap-1">
            <template v-if="project.techs?.length">
              <span
                v-for="tech in project.techs.slice(0, 2)"
                :key="tech"
                class="px-1.5 py-0.5 bg-foreground/[0.04] rounded text-[10px] text-foreground-muted"
              >
                {{ tech }}
              </span>
              <span v-if="project.techs.length > 2" class="text-[10px] text-foreground-muted/30">
                +{{ project.techs.length - 2 }}
              </span>
            </template>
            <span
              v-if="project.commentsCount > 0"
              class="inline-flex items-center gap-1 text-[10px] text-foreground-muted/30"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {{ project.commentsCount }}
            </span>
          </div>
        </div>
        <button
          @click="markAsCompleted(project.id, $event)"
          :disabled="updatingId === project.id"
          class="p-1 text-foreground-muted/15 hover:text-primary transition-colors disabled:opacity-50 shrink-0"
          title="Marquer terminé"
        >
          <span v-if="updatingId === project.id" class="block w-3.5 h-3.5 border-2 border-foreground-muted/40 border-t-transparent rounded-full animate-spin"></span>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>
      </NuxtLink>

      <NuxtLink
        v-for="project in completedProjects.slice(0, showCompleted ? undefined : 0)"
        :key="project.id"
        :to="`/qg/projects/${project.id}`"
        class="flex items-center gap-3 py-3 opacity-40 hover:opacity-60 transition-opacity group"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary shrink-0">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span class="text-[13px] text-foreground-muted truncate">
          {{ project.title }}
        </span>
      </NuxtLink>

      <button
        v-if="completedProjects.length > 0"
        @click="showCompleted = !showCompleted"
        class="flex items-center gap-1.5 pt-3 text-foreground-muted/30 hover:text-foreground-muted transition-colors text-[11px]"
      >
        <svg
          width="9"
          height="9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="['transition-transform', showCompleted ? 'rotate-180' : '']"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {{ showCompleted ? 'Masquer' : `${completedProjects.length} terminé${completedProjects.length > 1 ? 's' : ''}` }}
      </button>
    </div>
  </div>
</template>
