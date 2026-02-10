<script setup lang="ts">
const props = defineProps<{
  developerId: number | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const toast = useToast()

const developer = ref<any>(null)
const loading = ref(false)
const saving = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  bio: '',
  title: '',
  location: '',
  linkedinUrl: '',
  githubUrl: '',
  twitterUrl: '',
  website: ''
})

watch(() => props.developerId, async (id) => {
  if (!id) {
    developer.value = null
    return
  }

  loading.value = true
  try {
    const data = await $fetch(`/api/admin/developers/${id}`)
    developer.value = data

    const nameParts = (data.name || '').split(' ')
    form.firstName = nameParts[0] || ''
    form.lastName = nameParts.slice(1).join(' ') || ''

    form.email = data.email || ''
    form.bio = data.bio || ''
    form.title = data.title || ''
    form.location = data.location || ''
    form.linkedinUrl = data.linkedinUrl || ''
    form.githubUrl = data.githubUrl || ''
    form.twitterUrl = data.twitterUrl || ''
    form.website = data.website || ''
  } catch (err) {
    toast.error('Erreur lors du chargement du profil')
    emit('close')
  } finally {
    loading.value = false
  }
}, { immediate: true })

async function save() {
  if (!props.developerId) return

  saving.value = true
  try {
    await $fetch(`/api/admin/developers/${props.developerId}`, {
      method: 'PUT',
      body: form
    })
    toast.success('Profil mis à jour')
    emit('saved')
    emit('close')
  } catch (err) {
    toast.error('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="developerId"
      class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      @click="handleBackdropClick"
    >
      <div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-2xl shadow-2xl m-4">
        <div class="sticky top-0 z-10 flex items-center justify-between p-6 bg-background border-b border-border">
          <h2 class="font-display text-2xl font-medium">
            Modifier le profil
            <span v-if="developer" class="text-foreground-muted">· {{ developer.name }}</span>
          </h2>
          <button
            @click="emit('close')"
            class="p-2 hover:bg-border/10 rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div v-if="loading" class="p-12 flex items-center justify-center">
          <span class="w-8 h-8 border-2 border-foreground-muted border-t-transparent rounded-full animate-spin"></span>
        </div>

        <form v-else @submit.prevent="save" class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">Prénom</label>
              <input v-model="form.firstName" type="text" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">Nom</label>
              <input v-model="form.lastName" type="text" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">Email</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">Titre</label>
            <input v-model="form.title" type="text" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">Ville</label>
            <input v-model="form.location" type="text" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">Bio</label>
            <textarea v-model="form.bio" rows="4" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted"></textarea>
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">LinkedIn</label>
            <input v-model="form.linkedinUrl" type="url" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">GitHub</label>
            <input v-model="form.githubUrl" type="url" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">Twitter</label>
            <input v-model="form.twitterUrl" type="url" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
          </div>

          <div>
            <label class="block text-xs uppercase tracking-wide text-foreground-muted mb-2">Site web</label>
            <input v-model="form.website" type="url" class="w-full px-4 py-3 bg-background-card border border-border/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-foreground-muted" />
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-border/10">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-6 py-3 bg-primary border border-primary rounded-lg text-background font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button
              type="button"
              @click="emit('close')"
              class="px-6 py-3 border border-border rounded-lg hover:bg-border/10 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
