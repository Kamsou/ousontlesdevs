<script setup lang="ts">
interface HelpRequest {
  id: number
  title: string
  status: 'open' | 'in_progress' | 'closed'
  techs?: { id: number; techName: string }[]
}

defineProps<{
  openRequests: HelpRequest[]
  closedRequests: HelpRequest[]
  isLoading: boolean
}>()

const closingRequestId = ref<number | null>(null)
const showClosedRequests = ref(false)

const emit = defineEmits<{
  'mark-resolved': [requestId: number]
}>()

async function markAsResolved(requestId: number, e: Event) {
  e.preventDefault()
  e.stopPropagation()
  closingRequestId.value = requestId
  emit('mark-resolved', requestId)
  closingRequestId.value = null
}
</script>

<template>
  <section>
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 2" :key="i" class="py-3 animate-pulse">
        <div class="h-3.5 bg-border/10 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-border/10 rounded w-1/3"></div>
      </div>
    </div>

    <div v-else class="divide-y divide-border/20">
      <NuxtLink
        v-for="request in openRequests"
        :key="request.id"
        :to="`/qg/requests/${request.id}`"
        class="flex items-start gap-3 py-3 first:pt-0 hover:opacity-80 transition-opacity group"
      >
        <span class="w-1.5 h-1.5 bg-amber-400 rounded-full shrink-0 mt-1.5"></span>
        <div class="min-w-0 flex-1">
          <span class="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug block">
            {{ request.title }}
          </span>
          <div v-if="request.techs?.length" class="flex items-center gap-1 mt-1.5">
            <span
              v-for="tech in request.techs.slice(0, 2)"
              :key="tech.id"
              class="px-1.5 py-0.5 bg-foreground/[0.04] rounded text-[10px] text-foreground-muted"
            >
              {{ tech.techName }}
            </span>
            <span v-if="request.techs.length > 2" class="text-[10px] text-foreground-muted/30">
              +{{ request.techs.length - 2 }}
            </span>
          </div>
        </div>
        <button
          @click="markAsResolved(request.id, $event)"
          :disabled="closingRequestId === request.id"
          class="p-1 text-foreground-muted/20 hover:text-primary transition-colors disabled:opacity-50 shrink-0"
          title="Marquer résolu"
        >
          <span v-if="closingRequestId === request.id" class="block w-3.5 h-3.5 border-2 border-foreground-muted/40 border-t-transparent rounded-full animate-spin"></span>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>
      </NuxtLink>

      <div v-for="request in closedRequests.slice(0, showClosedRequests ? undefined : 0)" :key="request.id">
        <NuxtLink
          :to="`/qg/requests/${request.id}`"
          class="flex items-center gap-3 py-3 opacity-40 hover:opacity-60 transition-opacity group"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary shrink-0">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span class="text-[13px] text-foreground-muted truncate">
            {{ request.title }}
          </span>
        </NuxtLink>
      </div>

      <button
        v-if="closedRequests.length > 0"
        @click="showClosedRequests = !showClosedRequests"
        class="flex items-center gap-1.5 pt-3 text-foreground-muted/30 hover:text-foreground-muted transition-colors text-[11px]"
      >
        <svg
          width="9"
          height="9"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="['transition-transform', showClosedRequests ? 'rotate-180' : '']"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {{ showClosedRequests ? 'Masquer' : `${closedRequests.length} résolu${closedRequests.length > 1 ? 'es' : 'e'}` }}
      </button>
    </div>
  </section>
</template>
