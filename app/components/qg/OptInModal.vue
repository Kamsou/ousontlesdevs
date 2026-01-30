<script setup lang="ts">
const emit = defineEmits<{
  choice: [accepted: boolean]
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-md" @click="emit('choice', false)" />
        <dialog open role="dialog" aria-labelledby="optin-title" aria-describedby="optin-desc" class="relative bg-background border border-border/10 rounded-3xl p-10 max-w-lg w-full overflow-hidden">
          <div class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

          <div class="relative">
            <p class="text-[0.65rem] uppercase tracking-[0.3em] text-primary mb-6" aria-hidden="true">Psst...</p>

            <h2 id="optin-title" class="font-display text-3xl md:text-4xl font-medium leading-tight mb-4 text-foreground">
              Attends, lis ça<br />
              <span class="text-foreground">avant de fermer</span>
            </h2>

            <p id="optin-desc" class="text-foreground-muted text-base leading-relaxed mb-8 max-w-sm">
              News sur l'avancée du projet, sondages pour améliorer l'app ensemble. On construit ça avec toi.
            </p>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="emit('choice', true)"
                class="group flex-1 px-6 py-4 bg-foreground text-background rounded-full font-medium transition-all hover:bg-primary flex items-center justify-center gap-2"
              >
                Je veux ça
                <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button
                @click="emit('choice', false)"
                class="px-6 py-4 bg-transparent text-foreground-muted rounded-full font-medium transition-all hover:text-foreground"
              >
                Pas maintenant
              </button>
            </div>

            <p class="text-[0.7rem] text-foreground-muted mt-6">
              Zéro spam. Désinscription en 1 clic. Promis.
            </p>
          </div>
        </dialog>
      </div>
    </Transition>
  </Teleport>
</template>
