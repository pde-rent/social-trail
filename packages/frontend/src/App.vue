<template lang="pug">
.dark
  .min-h-screen.bg-gh-dark-bg.text-gh-dark-fg.flex.flex-col
    Header
    main.flex-1
      router-view
    Footer
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

const authStore = useAuthStore();

onMounted(() => {
  authStore.init();
});
</script>

<style>
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
body {
  @apply antialiased;
}

/* Custom scrollbar for dark mode */
.dark ::-webkit-scrollbar {
  width: 10px;
}

.dark ::-webkit-scrollbar-track {
  @apply bg-gh-dark-subtle;
}

.dark ::-webkit-scrollbar-thumb {
  @apply bg-gh-dark-border rounded-full;
}

.dark ::-webkit-scrollbar-thumb:hover {
  @apply bg-gh-dark-muted;
}
</style> 