<script setup lang="ts">
useSeoMeta({
  title: 'Le QG - L\'espace privé des développeuses | OSLD',
  description: 'Derrière la vitrine publique, un espace entre nous. Entraide, side projects, offres d\'emploi. Juste entre devs.',
  ogTitle: 'Le QG - L\'espace privé des développeuses | OSLD',
  ogDescription: 'Derrière la vitrine publique, un espace entre nous. Entraide, side projects, offres d\'emploi. Juste entre devs.',
  ogImage: 'https://ousontlesdeveloppeuses.fr/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Le QG - L\'espace privé des développeuses | OSLD',
  twitterDescription: 'Derrière la vitrine publique, un espace entre nous. Entraide, side projects, offres d\'emploi. Juste entre devs.',
  twitterImage: 'https://ousontlesdeveloppeuses.fr/og-image.png',
})

onMounted(() => {
  navigateTo('/#qg', { replace: true })
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-pulse text-foreground-muted">Redirection...</div>
  </div>
</template>
