<script setup lang="ts">
const route = useRoute()
const token = route.params.token as string

useSeoMeta({
  title: 'Ton retour',
  robots: 'noindex'
})

const { data, status, error } = await useFetch(`/api/feedback/${token}`)

const form = ref({
  exchangeHappened: null as boolean | null,
  usefulnessRating: null as number | null,
  comment: ''
})

const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

async function submit() {
  if (form.value.exchangeHappened === null) return

  submitting.value = true
  submitError.value = ''

  try {
    await $fetch(`/api/feedback/${token}`, {
      method: 'POST',
      body: {
        exchangeHappened: form.value.exchangeHappened,
        usefulnessRating: form.value.usefulnessRating,
        comment: form.value.comment
      }
    })
    submitted.value = true
  } catch (e: any) {
    submitError.value = e.data?.message || 'Erreur lors de l\'envoi'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div v-if="status === 'pending'" class="text-center">
        <div class="w-8 h-8 border-2 border-foreground-muted border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <div v-else-if="error" class="text-center">
        <p class="text-foreground-muted mb-4">Ce lien n'est plus valide.</p>
        <NuxtLink to="/" class="text-sm text-foreground-muted hover:text-foreground underline">
          Retour à l'accueil
        </NuxtLink>
      </div>

      <div v-else-if="data?.alreadySubmitted || submitted" class="text-center">
        <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-400">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 class="font-display text-2xl font-medium mb-2">Merci !</h1>
        <p class="text-foreground-muted">Ton retour nous aide à améliorer OSLD.</p>
      </div>

      <div v-else>
        <h1 class="font-display text-2xl font-medium mb-2 text-center">
          Comment ça s'est passé ?
        </h1>
        <p class="text-foreground-muted text-center mb-8">
          Tu as contacté <span class="text-foreground">{{ data?.recipientName }}</span> il y a quelques jours.
        </p>

        <form @submit.prevent="submit" class="space-y-8">
          <div>
            <p class="text-sm font-medium mb-4">L'échange a-t-il eu lieu ?</p>
            <div class="flex gap-4">
              <button
                type="button"
                @click="form.exchangeHappened = true"
                :class="[
                  'flex-1 py-3 rounded-xl border transition-all',
                  form.exchangeHappened === true
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-border/10 hover:border-foreground-muted'
                ]"
              >
                Oui
              </button>
              <button
                type="button"
                @click="form.exchangeHappened = false; form.usefulnessRating = null"
                :class="[
                  'flex-1 py-3 rounded-xl border transition-all',
                  form.exchangeHappened === false
                    ? 'border-red-500 bg-red-500/10 text-red-400'
                    : 'border-border/10 hover:border-foreground-muted'
                ]"
              >
                Non
              </button>
            </div>
          </div>

          <div v-if="form.exchangeHappened === true">
            <p class="text-sm font-medium mb-4">C'était utile ?</p>
            <div class="flex justify-between gap-2">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                @click="form.usefulnessRating = n"
                :class="[
                  'flex-1 py-3 rounded-xl border transition-all text-sm',
                  form.usefulnessRating === n
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border/10 hover:border-foreground-muted'
                ]"
              >
                {{ n }}
              </button>
            </div>
            <div class="flex justify-between text-xs text-foreground-muted mt-2 px-1">
              <span>Pas du tout</span>
              <span>Très utile</span>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium mb-2 block">Un commentaire ? (optionnel)</label>
            <textarea
              v-model="form.comment"
              rows="3"
              maxlength="500"
              placeholder="Ce qui a bien marché, ce qu'on pourrait améliorer..."
              class="w-full px-4 py-3 bg-white/5 border border-border/10 rounded-xl text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-foreground-muted resize-none"
            ></textarea>
          </div>

          <p v-if="submitError" class="text-sm text-red-400">{{ submitError }}</p>

          <button
            type="submit"
            :disabled="form.exchangeHappened === null || submitting"
            class="w-full py-3 bg-foreground text-background rounded-xl font-medium transition-opacity disabled:opacity-50"
          >
            {{ submitting ? 'Envoi...' : 'Envoyer' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
