<script setup lang="ts">
interface FeedRequest {
  id: number
  title: string
  commentCount?: number
  developer?: {
    id: number
    slug: string
    name: string
    avatarUrl?: string
    linkedinUrl?: string
  }
  techs?: { id: number; techName: string }[]
}

interface FeedData {
  requests: FeedRequest[]
  resolvedRequests: FeedRequest[]
  pagination: { hasMore: boolean; total: number }
}

const feedPage = ref(1)
const feedData = ref<FeedData | null>(null)
const isLoadingFeed = ref(false)
const isLoadingMore = ref(false)
const showResolvedRequests = ref(false)

async function loadFeed(page = 1) {
  if (page === 1) {
    isLoadingFeed.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    const data = await $fetch<FeedData>('/api/help-requests/feed', {
      query: { page }
    })

    if (page === 1) {
      feedData.value = data
    } else if (feedData.value) {
      feedData.value.requests.push(...data.requests)
      feedData.value.pagination = data.pagination
    }
    feedPage.value = page
  } catch {
  } finally {
    isLoadingFeed.value = false
    isLoadingMore.value = false
  }
}

function loadMoreFeed() {
  loadFeed(feedPage.value + 1)
}

onMounted(() => {
  loadFeed()
})
</script>

<template>
  <section>
    <h2 class="text-lg font-display font-medium mb-6">Coups de main demandés</h2>

    <div v-if="isLoadingFeed" class="space-y-4">
      <div v-for="i in 3" :key="i" class="p-4 border border-border/20 rounded-xl animate-pulse">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 bg-border/20 rounded-full"></div>
          <div class="h-4 bg-border/20 rounded w-24"></div>
        </div>
        <div class="h-4 bg-border/20 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-border/20 rounded w-1/4"></div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div v-if="!feedData?.requests?.length" class="py-12 text-center border border-dashed border-border/20 rounded-xl">
        <p class="text-foreground-muted text-sm">Aucune demande pour le moment</p>
      </div>
      <template v-else>
      <div
        v-for="request in feedData.requests"
        :key="request.id"
        class="p-4 border border-border/20 rounded-xl hover:border-primary/20 transition-colors"
      >
        <div class="flex items-center justify-between gap-3 mb-2">
          <NuxtLink
            :to="`/directory/${request.developer?.slug}`"
            class="flex items-center gap-3 min-w-0 group/dev"
          >
            <img
              v-if="request.developer?.avatarUrl"
              :src="request.developer.avatarUrl"
              :alt="request.developer.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div v-else class="w-8 h-8 rounded-full bg-border/30 flex items-center justify-center">
              <span class="text-xs text-foreground-muted">{{ request.developer?.name?.charAt(0) || '?' }}</span>
            </div>
            <span class="text-sm text-foreground-muted group-hover/dev:text-foreground transition-colors truncate">{{ request.developer?.name }}</span>
          </NuxtLink>
          <a
            v-if="request.developer?.linkedinUrl"
            :href="request.developer.linkedinUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground-muted hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-full transition-colors"
            title="Voir le profil LinkedIn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
          </a>
        </div>

        <NuxtLink
          :to="`/qg/requests/${request.id}`"
          class="text-sm font-medium text-foreground hover:text-primary transition-colors block"
        >{{ request.title }}</NuxtLink>

        <div class="flex items-center gap-3 mt-2.5">
          <div v-if="request.techs?.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="tech in request.techs.slice(0, 4)"
              :key="tech.id"
              class="px-2 py-0.5 bg-subtle rounded text-xs text-foreground-muted"
            >
              {{ tech.techName }}
            </span>
            <span v-if="request.techs.length > 4" class="text-xs text-foreground-muted/40">
              +{{ request.techs.length - 4 }}
            </span>
          </div>
          <span v-if="request.commentCount" class="flex items-center gap-1 px-2 py-0.5 bg-subtle rounded text-xs text-foreground-muted ml-auto">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {{ request.commentCount }}
          </span>
        </div>
      </div>
      </template>

      <div v-for="request in feedData?.resolvedRequests?.slice(0, showResolvedRequests ? undefined : 0)" :key="request.id" class="mt-3">
        <div class="p-4 rounded-xl hover:bg-foreground/[0.02] transition-all">
          <div class="flex items-center justify-between gap-3 mb-2">
            <NuxtLink
              :to="`/directory/${request.developer?.slug}`"
              class="flex items-center gap-3 min-w-0 group/dev"
            >
              <img
                v-if="request.developer?.avatarUrl"
                :src="request.developer.avatarUrl"
                :alt="request.developer.name"
                class="w-8 h-8 rounded-full object-cover opacity-60"
              />
              <div v-else class="w-8 h-8 rounded-full bg-border/30 flex items-center justify-center opacity-60">
                <span class="text-xs text-foreground-muted">{{ request.developer?.name?.charAt(0) || '?' }}</span>
              </div>
              <span class="text-sm text-foreground-muted/60 group-hover/dev:text-foreground-muted transition-colors truncate">{{ request.developer?.name }}</span>
            </NuxtLink>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500/50 shrink-0">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <NuxtLink
            :to="`/qg/requests/${request.id}`"
            class="text-sm font-medium text-foreground-muted/60 hover:text-foreground-muted transition-colors block"
          >{{ request.title }}</NuxtLink>

          <div class="flex items-center gap-3 mt-2.5">
            <div v-if="request.techs?.length" class="flex flex-wrap gap-1.5">
              <span
                v-for="tech in request.techs.slice(0, 4)"
                :key="tech.id"
                class="px-2 py-0.5 bg-subtle rounded text-xs text-foreground-muted/50"
              >
                {{ tech.techName }}
              </span>
            </div>
            <span v-if="request.commentCount" class="flex items-center gap-1 px-2 py-0.5 bg-subtle rounded text-xs text-foreground-muted/50 ml-auto">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {{ request.commentCount }}
            </span>
          </div>
        </div>
      </div>

      <button
        v-if="(feedData?.resolvedRequests?.length ?? 0) > 0"
        @click="showResolvedRequests = !showResolvedRequests"
        class="flex items-center gap-2 px-4 py-2 mt-4 text-foreground-muted hover:text-foreground transition-colors text-xs"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="['transition-transform', showResolvedRequests ? 'rotate-180' : '']"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
        {{ showResolvedRequests ? 'Masquer' : `Voir ${feedData?.resolvedRequests?.length ?? 0} résolue${(feedData?.resolvedRequests?.length ?? 0) > 1 ? 's' : ''}` }}
      </button>

      <button
        v-if="feedData?.pagination?.hasMore"
        @click="loadMoreFeed"
        :disabled="isLoadingMore"
        class="w-full py-3 text-sm text-foreground-muted hover:text-foreground border border-border/20 hover:border-border/40 rounded-xl transition-colors disabled:opacity-50"
      >
        {{ isLoadingMore ? 'Chargement...' : 'Voir plus' }}
      </button>
    </div>
  </section>
</template>
