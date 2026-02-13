<script setup lang="ts">
useSeoMeta({
  title: 'Mission OSLD - Pourquoi Où Sont Les Développeuses ?',
  description: 'Visibilité, communauté, inspiration. OSLD rend visibles les développeuses en France et crée un réseau pour s\'entraider.',
  ogTitle: 'Mission OSLD - Pourquoi Où Sont Les Développeuses ?',
  ogDescription: 'Visibilité, communauté, inspiration. OSLD rend visibles les développeuses en France et crée un réseau pour s\'entraider.',
  ogImage: 'https://ousontlesdeveloppeuses.fr/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Mission OSLD - Pourquoi Où Sont Les Développeuses ?',
  twitterDescription: 'Visibilité, communauté, inspiration. OSLD rend visibles les développeuses en France et crée un réseau pour s\'entraider.',
  twitterImage: 'https://ousontlesdeveloppeuses.fr/og-image.png',
})

onMounted(() => {
  navigateTo('/#mission', { replace: true })
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-pulse text-foreground-muted">Redirection...</div>
  </div>
</template>
