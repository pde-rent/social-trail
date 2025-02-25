<template lang="pug">
.container.mx-auto.px-4.py-8
  // Hero section
  section.mb-16.mt-8
    .max-w-4xl.mx-auto.text-center
      h1.text-4xl.font-bold.mb-4.bg-clip-text.text-transparent.bg-gradient-to-r.from-gh-dark-primary.to-blue-400 Track Your Social Contributions
      p.text-xl.text-gh-dark-secondary.mb-8 Earn points by engaging with content across multiple platforms
      
      .flex.justify-center.space-x-4
        router-link.px-6.py-3.bg-gh-dark-primary.text-white.rounded-md.hover_bg-opacity-90.transition-colors(
          to="/auth"
          v-if="!authStore.user"
        ) Get Started
        router-link.px-6.py-3.bg-gh-dark-hover.text-gh-dark-fg.border.border-gh-dark-border.rounded-md.hover_bg-opacity-90.transition-colors(
          to="/explore"
        ) Explore
  
  // Features section
  section.grid.grid-cols-1.md_grid-cols-3.gap-8.mb-16
    .bg-gh-dark-subtle.p-6.rounded-lg.border.border-gh-dark-border.transform.transition-transform.hover_translate-y-1
      .text-gh-dark-primary.text-2xl.mb-4
        font-awesome-icon.mr-2(icon="fa-solid fa-plug")
        span Connect Platforms
      p.text-gh-dark-secondary Link your social accounts from X, YouTube, TikTok, Instagram, and more.
    
    .bg-gh-dark-subtle.p-6.rounded-lg.border.border-gh-dark-border.transform.transition-transform.hover_translate-y-1
      .text-gh-dark-primary.text-2xl.mb-4
        font-awesome-icon.mr-2(icon="fa-solid fa-chart-line")
        span Track Activity
      p.text-gh-dark-secondary Automatically track your posts, comments, likes, and shares.
    
    .bg-gh-dark-subtle.p-6.rounded-lg.border.border-gh-dark-border.transform.transition-transform.hover_translate-y-1
      .text-gh-dark-primary.text-2xl.mb-4
        font-awesome-icon.mr-2(icon="fa-solid fa-award")
        span Earn Rewards
      p.text-gh-dark-secondary Get rewarded for your social engagement and climb the leaderboard.
  
  // How it works
  section.mb-16
    h2.text-2xl.font-bold.text-center.mb-8.text-gh-dark-fg How SocialTrail Works
    .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.overflow-hidden
      .grid.grid-cols-1.md_grid-cols-3
        .p-6.border-b.md_border-b-0.md_border-r.border-gh-dark-border
          .flex.items-center.mb-3
            .text-2xl.font-bold.text-gh-dark-primary.mr-2 1.
            .text-xl.font-medium.text-gh-dark-fg Connect
          p.text-gh-dark-secondary Link your social media accounts to our platform
        
        .p-6.border-b.md_border-b-0.md_border-r.border-gh-dark-border
          .flex.items-center.mb-3
            .text-2xl.font-bold.text-gh-dark-primary.mr-2 2.
            .text-xl.font-medium.text-gh-dark-fg Engage
          p.text-gh-dark-secondary Continue using your social platforms as usual
        
        .p-6
          .flex.items-center.mb-3
            .text-2xl.font-bold.text-gh-dark-primary.mr-2 3.
            .text-xl.font-medium.text-gh-dark-fg Earn
          p.text-gh-dark-secondary Automatically earn points for your social activity
  
  // Testimonials or stats
  section.mb-16
    .grid.grid-cols-1.md_grid-cols-3.gap-4.text-center
      .p-6
        .text-4xl.font-bold.text-gh-dark-primary 10K+
        .text-gh-dark-secondary Users
      .p-6
        .text-4xl.font-bold.text-gh-dark-primary 50M+
        .text-gh-dark-secondary Tracked Activities
      .p-6
        .text-4xl.font-bold.text-gh-dark-primary 100+
        .text-gh-dark-secondary Supported Platforms
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
</script> 