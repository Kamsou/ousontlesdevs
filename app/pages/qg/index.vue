<script setup lang="ts">
import { useAuth } from '#imports'
import type { QgProfile, QgActivity, HelpRequest, Offer } from '~/types/qg'

definePageMeta({
  middleware: 'sidebase-auth'
})

useSeoMeta({
  title: 'Mon QG',
  robots: 'noindex'
})

const route = useRoute()
const router = useRouter()
const { $clientPosthog } = useNuxtApp()
const { data: session } = useAuth()
const { preference: themePreference, cycle: cycleTheme } = useQgTheme()
const themeLabel = computed(() => {
  if (themePreference.value === 'system') return 'Thème système'
  if (themePreference.value === 'light') return 'Thème clair'
  return 'Thème sombre'
})
const { data: requests, status: requestsStatus, refresh: refreshRequests } = useLazyFetch<HelpRequest[]>('/api/help-requests')
const { data: activity, status: activityStatus, refresh: refreshActivity } = useLazyFetch<QgActivity>('/api/qg/activity')
const { data: myProjects, status: projectsStatus, refresh: refreshProjects } = useLazyFetch<any[]>('/api/side-projects/mine')
const { data: offers, status: offersStatus, refresh: refreshOffers } = useLazyFetch<Offer[]>('/api/offers')
const { data: profile, refresh: refreshProfile } = await useFetch<QgProfile | null>('/api/developers/me', {
  default: () => null
})
const { data: isAdmin } = useLazyFetch('/api/admin/check', {
  default: () => false
})

const TABS = {
  ENTRAIDE: 'entraide',
  CHALLENGES: 'challenges',
  OPPORTUNITES: 'opportunites',
  PROFIL: 'profil',
} as const

const TAB_ALIASES = {
  offres: TABS.OPPORTUNITES,
  projects: TABS.OPPORTUNITES,
} as const

type TabType = typeof TABS[keyof typeof TABS]

function getTabFromQuery(tab: any): TabType {
  if (tab === TABS.PROFIL) return TABS.PROFIL
  if (tab === TABS.CHALLENGES) return TABS.CHALLENGES
  if (tab === TABS.OPPORTUNITES || tab in TAB_ALIASES) {
    return TAB_ALIASES[tab as keyof typeof TAB_ALIASES] || TABS.OPPORTUNITES
  }
  return TABS.ENTRAIDE
}

const activeTab = ref<TabType>(getTabFromQuery(route.query.tab))
const showOptInModal = ref(false)
const isLoadingRequests = computed(() => requestsStatus.value === 'pending')
const isLoadingActivity = computed(() => activityStatus.value === 'pending')
const isLoadingProjects = computed(() => projectsStatus.value === 'pending')
const isLoadingOffers = computed(() => offersStatus.value === 'pending')

const openRequests = computed(() =>
  requests.value?.filter(r => r.status === 'open') || []
)
const closedRequests = computed(() =>
  requests.value?.filter(r => r.status === 'closed') || []
)
const myOffers = computed(() =>
  offers.value?.filter(o => o.developer?.id === profile.value?.id) || []
)
const isNewProfile = computed(() => !profile.value)

const lookingForDaysLeft = computed(() => {
  if (!profile.value?.lookingForSince || !profile.value?.lookingFor?.length) return null
  const since = new Date(profile.value.lookingForSince).getTime()
  const expiresAt = since + 30 * 24 * 60 * 60 * 1000
  return Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000))
})

const showLookingForBanner = computed(() => {
  if (lookingForDaysLeft.value === null) return false
  return lookingForDaysLeft.value <= 7
})

async function renewLookingFor() {
  if (!profile.value) return
  try {
    await $fetch(`/api/developers/${profile.value.id}`, {
      method: 'PUT',
      body: { lookingFor: profile.value.lookingFor }
    })
    await refreshProfile()
  } catch {
  }
}

async function handleOptInChoice(choice: boolean) {
  showOptInModal.value = false
  $clientPosthog?.capture('email_optin_response', { accepted: choice })

  if (profile.value) {
    try {
      await $fetch(`/api/developers/${profile.value.id}`, {
        method: 'PUT',
        body: { emailOptIn: choice }
      })
      profile.value.emailOptIn = choice
      profile.value.emailOptInAsked = true
    } catch {
    }
  }
}

async function handleMarkResolved(requestId: number) {
  try {
    await $fetch(`/api/help-requests/${requestId}`, {
      method: 'PATCH',
      body: { status: 'closed' }
    })
    await refreshRequests()
  } catch (error) {
    console.error('Erreur:', error)
  }
}

async function handleProfileSaved() {
  const wasNew = isNewProfile.value
  await Promise.all([refreshProfile(), refreshActivity()])
  if (wasNew) {
    activeTab.value = TABS.ENTRAIDE
  }
}

async function handleMarkProjectCompleted(projectId: number) {
  try {
    await $fetch(`/api/side-projects/${projectId}`, {
      method: 'PATCH',
      body: { status: 'completed' }
    })
    await refreshProjects()
  } catch (error) {
    console.error('Erreur:', error)
  }
}
watch(() => route.query.tab, (tab) => {
  activeTab.value = getTabFromQuery(tab)
})

watch(activeTab, (tab) => {
  router.replace({ query: tab === TABS.ENTRAIDE ? {} : { tab } })
  $clientPosthog?.capture('qg_tab_clicked', { tab })
})
const toast = useToast()

onMounted(() => {
  if (profile.value && !profile.value.emailOptInAsked) {
    showOptInModal.value = true
  }
  if (route.query.renewed === '1') {
    toast.success('Recherche renouvelée pour 30 jours')
    router.replace({ query: { tab: route.query.tab } })
  }
  if (route.query.deactivated === '1') {
    toast.success('Recherche désactivée')
    router.replace({ query: { tab: route.query.tab } })
  }
})
</script>

<template>
  <ClientOnly>
    <QgOptInModal v-if="showOptInModal" @choice="handleOptInChoice" />
  </ClientOnly>

  <div class="min-h-screen bg-background">
    <header class="sticky top-0 z-50 px-4 md:px-8 py-3 backdrop-blur-xl bg-background/80 border-b border-border/20">
      <div class="max-w-3xl mx-auto flex items-center justify-between">
        <NuxtLink to="/directory" class="flex items-center gap-2 no-underline text-foreground-muted hover:text-foreground transition-colors text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Retour
        </NuxtLink>
        <h1 class="font-display text-sm font-semibold tracking-widest text-primary m-0">MON QG</h1>
        <div class="flex items-center gap-3">
          <NuxtLink v-if="isAdmin" to="/admin" class="flex items-center justify-center w-8 h-8 rounded-full border border-border/10 text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors" title="Dashboard admin">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </NuxtLink>
          <button @click="cycleTheme" class="flex items-center justify-center w-8 h-8 rounded-full border border-border/10 text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors" :title="themeLabel">
            <svg v-if="themePreference === 'system'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <svg v-else-if="themePreference === 'light'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <img v-if="session?.user?.image" :src="optimizedAvatar(session.user.image, 64)" :alt="session.user.name || ''" class="w-8 h-8 rounded-full border border-border/10" />
          <span v-else class="w-8 h-8 rounded-full bg-border/50"></span>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-6 pt-4 md:pt-8 pb-4 md:pb-6">
      <ClientOnly>
        <div v-if="isLoadingActivity" class="mb-4 md:mb-6">
          <div class="h-4 w-28 bg-border/20 rounded animate-pulse mb-3"></div>
          <div class="flex flex-wrap gap-2">
            <div class="h-8 w-32 bg-border/20 rounded-full animate-pulse"></div>
            <div class="h-8 w-44 bg-border/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <QgWeeklyActivity
          v-else-if="activity && !activity.isNew"
          :activity="activity"
          class="mb-4 md:mb-6"
          @go-to-profile="activeTab = TABS.PROFIL"
        />
        <template #fallback>
          <div class="mb-4 md:mb-6">
            <div class="h-4 w-28 bg-border/20 rounded animate-pulse mb-3"></div>
            <div class="flex flex-wrap gap-2">
              <div class="h-8 w-32 bg-border/20 rounded-full animate-pulse"></div>
              <div class="h-8 w-44 bg-border/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <nav class="hidden md:block sticky top-[49px] z-40 bg-background border-b border-border/10">
      <div class="max-w-3xl mx-auto px-6 flex gap-6">
        <button
          @click="activeTab = TABS.ENTRAIDE"
          :class="[
            'pt-3 pb-3 text-sm font-medium transition-colors relative',
            activeTab === TABS.ENTRAIDE
              ? 'text-foreground'
              : 'text-foreground-muted hover:text-foreground'
          ]"
        >
          Entraide
          <span v-if="activeTab === TABS.ENTRAIDE" class="absolute bottom-0 left-0 right-0 h-px bg-primary"></span>
        </button>
        <!-- Challenges tab hidden for now -->
        <button
          @click="activeTab = TABS.OPPORTUNITES"
          :class="[
            'pt-3 pb-3 text-sm font-medium transition-colors relative',
            activeTab === TABS.OPPORTUNITES
              ? 'text-foreground'
              : 'text-foreground-muted hover:text-foreground'
          ]"
        >
          Opportunités
          <span v-if="activeTab === TABS.OPPORTUNITES" class="absolute bottom-0 left-0 right-0 h-px bg-primary"></span>
        </button>
        <button
          @click="activeTab = TABS.PROFIL"
          :class="[
            'pt-3 pb-3 text-sm font-medium transition-colors relative',
            activeTab === TABS.PROFIL
              ? 'text-foreground'
              : 'text-foreground-muted hover:text-foreground'
          ]"
        >
          Profil
          <span v-if="activeTab === TABS.PROFIL" class="absolute bottom-0 left-0 right-0 h-px bg-primary"></span>
        </button>
      </div>
    </nav>

    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/20 pb-[env(safe-area-inset-bottom)]">
      <div class="flex justify-around">
        <button
          @click="activeTab = TABS.ENTRAIDE"
          :class="[
            'flex flex-col items-center gap-1 pt-2.5 pb-2 px-4 text-[11px] font-medium transition-colors',
            activeTab === TABS.ENTRAIDE ? 'text-primary' : 'text-foreground-muted'
          ]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="activeTab === TABS.ENTRAIDE ? 'currentColor' : 'currentColor'" stroke-width="1.5">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Entraide
        </button>
        <!-- Challenges tab hidden for now -->
        <button
          @click="activeTab = TABS.OPPORTUNITES"
          :class="[
            'flex flex-col items-center gap-1 pt-2.5 pb-2 px-4 text-[11px] font-medium transition-colors',
            activeTab === TABS.OPPORTUNITES ? 'text-primary' : 'text-foreground-muted'
          ]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
          </svg>
          Opportunités
        </button>
        <button
          @click="activeTab = TABS.PROFIL"
          :class="[
            'flex flex-col items-center gap-1 pt-2.5 pb-2 px-4 text-[11px] font-medium transition-colors',
            activeTab === TABS.PROFIL ? 'text-primary' : 'text-foreground-muted'
          ]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Profil
        </button>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-6 py-4 md:py-8 pb-24 md:pb-8">
      <div v-if="showLookingForBanner" class="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p v-if="lookingForDaysLeft! <= 0" class="text-sm text-amber-700 dark:text-amber-400 font-medium">Ta recherche active a expiré</p>
          <p v-else class="text-sm text-amber-700 dark:text-amber-400 font-medium">Ta recherche active expire dans {{ lookingForDaysLeft }} jour{{ lookingForDaysLeft! > 1 ? 's' : '' }}</p>
          <p class="text-xs text-foreground-muted mt-1">Renouvelle-la pour rester visible dans l'annuaire.</p>
        </div>
        <button @click="renewLookingFor" class="px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-medium cursor-pointer transition-all hover:-translate-y-0.5 shrink-0">
          Renouveler
        </button>
      </div>

      <div v-if="activeTab === TABS.ENTRAIDE" class="space-y-10 md:space-y-14">
        <QgIncompleteProfileBanner
          v-if="!isLoadingActivity && activity?.profileComplete === false"
          :missing-fields="activity?.missingFields || []"
          context="à l'entraide"
          @go-to-profile="activeTab = TABS.PROFIL"
        />

        <section>
          <NuxtLink
            v-if="activity?.profileComplete !== false"
            to="/qg/ask"
            class="group block p-5 md:p-8 border border-b-[3px] border-primary/20 border-b-primary/60 rounded-2xl transition-all hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-glow hover:-translate-y-0.5 active:translate-y-px active:border-b active:shadow-none"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <h2 class="text-xl md:text-2xl font-display font-medium mb-2">
                  Besoin d'un coup de main ?
                </h2>
                <p class="text-foreground-muted text-sm">
                  Décris ton blocage, on te trouve quelqu'un.
                </p>
              </div>
              <span class="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </div>
          </NuxtLink>
          <div
            v-else
            class="block p-5 md:p-8 border border-border/20 rounded-2xl cursor-not-allowed"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-xl md:text-2xl font-display font-medium mb-2 text-foreground-muted">
                  Besoin d'un coup de main ?
                </h2>
                <p class="text-foreground-muted/60 text-sm">
                  Complète ton profil pour demander de l'aide
                </p>
              </div>
              <span class="w-10 h-10 flex items-center justify-center rounded-full bg-border/20 shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-foreground-muted/50">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 md:p-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </span>
            <h2 class="text-base font-display font-semibold text-foreground">Tes demandes</h2>
          </div>

          <div v-if="isLoadingRequests || openRequests.length > 0 || closedRequests.length > 0">
            <QgRequestsList
              :open-requests="openRequests"
              :closed-requests="closedRequests"
              :is-loading="isLoadingRequests"
              @mark-resolved="handleMarkResolved"
            />
          </div>
          <div v-else class="py-8 text-center">
            <p class="text-foreground-muted text-sm">Tu n'as pas encore de demande d'aide</p>
            <p class="text-foreground-muted/60 text-xs mt-1">Décris ton blocage et la communauté t'aidera</p>
          </div>
        </section>

        <div class="flex items-center gap-4">
          <div class="flex-1 h-px bg-border"></div>
          <span class="text-xs font-medium text-foreground-muted/40 uppercase tracking-widest">Communauté</span>
          <div class="flex-1 h-px bg-border"></div>
        </div>

        <QgFeed />
      </div>

      <div v-else-if="activeTab === TABS.CHALLENGES">
        <QgIncompleteProfileBanner
          v-if="!isLoadingActivity && activity?.profileComplete === false"
          :missing-fields="activity?.missingFields || []"
          context="aux challenges"
          class="mb-8"
          @go-to-profile="activeTab = TABS.PROFIL"
        />
        <QgChallenges v-else />
      </div>

      <div v-else-if="activeTab === TABS.OPPORTUNITES" class="space-y-10 md:space-y-14">
        <div v-if="activity?.profileComplete !== false" class="flex flex-col sm:flex-row gap-3">
          <NuxtLink
            to="/qg/new-offer"
            class="group flex-1 block p-5 border border-b-[3px] border-primary/20 border-b-primary/60 rounded-2xl transition-all hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-glow hover:-translate-y-0.5 active:translate-y-px active:border-b active:shadow-none no-underline"
          >
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                </svg>
              </span>
              <div>
                <span class="block text-sm font-medium text-foreground">Poster une offre</span>
                <span class="block text-xs text-foreground-muted">Alternance, stage, CDI...</span>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
            to="/qg/new-project"
            class="group flex-1 block p-5 border border-b-[3px] border-primary/20 border-b-primary/60 rounded-2xl transition-all hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-glow hover:-translate-y-0.5 active:translate-y-px active:border-b active:shadow-none no-underline"
          >
            <div class="flex items-center gap-3">
              <span class="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </span>
              <div>
                <span class="block text-sm font-medium text-foreground">Side project</span>
                <span class="block text-xs text-foreground-muted">Trouve des contributrices</span>
              </div>
            </div>
          </NuxtLink>
        </div>
        <QgIncompleteProfileBanner
          v-else
          :missing-fields="activity?.missingFields || []"
          context="aux opportunités"
          @go-to-profile="activeTab = TABS.PROFIL"
        />

        <section class="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 md:p-6">
          <div class="flex items-center gap-3 mb-6">
            <span class="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </span>
            <h2 class="text-base font-display font-semibold text-foreground">Tes publications</h2>
          </div>

          <div v-if="myOffers.length > 0 || (myProjects || []).length > 0">
            <QgMyOffersList
              :offers="myOffers"
              :is-loading="isLoadingOffers"
              :current-user-id="profile?.id"
              @deleted="refreshOffers()"
            />
            <QgMyProjectsList
              :projects="myProjects || []"
              :is-loading="isLoadingProjects"
              @mark-completed="handleMarkProjectCompleted"
            />
          </div>
          <div v-else class="py-8 text-center">
            <p class="text-foreground-muted text-sm">Tu n'as pas encore de publication</p>
            <p class="text-foreground-muted/60 text-xs mt-1">Poste une offre ou un side project pour commencer</p>
          </div>
        </section>

        <div class="flex items-center gap-4">
          <div class="flex-1 h-px bg-border"></div>
          <span class="text-xs font-medium text-foreground-muted/40 uppercase tracking-widest">Communauté</span>
          <div class="flex-1 h-px bg-border"></div>
        </div>

        <QgOffersList
          :offers="offers || []"
          :is-loading="isLoadingOffers"
          :current-user-id="profile?.id"
        />

        <QgSideProjectsList />
      </div>

      <div v-else>
        <QgProfileForm
          :profile="profile ?? null"
          :session-user-name="session?.user?.name || undefined"
          @saved="handleProfileSaved"
        />
      </div>
    </div>
  </div>
</template>
