<script setup lang="ts">
import { typeLabels, typeColors } from '~/utils/offerTypes'

interface Offer {
  id: number
  title: string
  description: string | null
  url: string | null
  type: string
  location: string | null
  verified: boolean
  createdAt: string
}

const props = defineProps<{
  offers: Offer[]
  isLoading: boolean
  currentUserId?: number
}>()

const emit = defineEmits<{
  deleted: []
}>()

const deleting = ref<number | null>(null)
const expandedOfferId = ref<number | null>(null)

function toggleComments(offerId: number) {
  expandedOfferId.value = expandedOfferId.value === offerId ? null : offerId
}

async function deleteOffer(id: number, e: Event) {
  e.preventDefault()
  e.stopPropagation()
  if (!confirm('Supprimer cette offre ?')) return
  deleting.value = id
  try {
    await $fetch(`/api/offers/${id}`, { method: 'DELETE' })
    emit('deleted')
  } catch {
  } finally {
    deleting.value = null
  }
}
</script>

<template>
  <div v-if="offers.length" class="mb-8">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xs font-display font-bold uppercase tracking-wide">Offres</h3>
      <span class="text-[11px] text-foreground-muted/30">{{ offers.length }}</span>
    </div>

    <div class="divide-y divide-border/20">
      <div
        v-for="offer in offers"
        :id="`offer-${offer.id}`"
        :key="offer.id"
      >
        <div class="flex items-start gap-3 py-3 first:pt-0 group">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 mb-1">
              <span
                class="px-1.5 py-0.5 text-[10px] font-medium border rounded-full shrink-0"
                :class="typeColors[offer.type] || typeColors.other"
              >
                {{ typeLabels[offer.type] || offer.type }}
              </span>
              <span
                v-if="offer.verified"
                class="text-[10px] text-green-700 dark:text-green-400"
              >Vérifié</span>
            </div>
            <span class="text-[13px] font-bold text-foreground leading-snug line-clamp-2 block">
              <a
                v-if="offer.url"
                :href="offer.url"
                target="_blank"
                rel="noopener noreferrer"
                class="underline underline-offset-2 decoration-border/30 hover:decoration-primary transition-colors"
              >
                {{ offer.title }}
              </a>
              <template v-else>{{ offer.title }}</template>
            </span>
            <span v-if="offer.location" class="text-[10px] text-foreground-muted/40 mt-0.5 block">{{ offer.location }}</span>
          </div>
          <button
            @click="deleteOffer(offer.id, $event)"
            :disabled="deleting === offer.id"
            class="p-1 text-foreground-muted/15 hover:text-red-700 dark:hover:text-red-400 transition-colors disabled:opacity-50 shrink-0"
            title="Supprimer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="expandedOfferId === offer.id" class="pb-3">
          <QgComments
            :offer-id="offer.id"
            :current-user-id="currentUserId"
            :is-owner="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
