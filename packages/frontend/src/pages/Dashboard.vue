<template lang="pug">
.container.mx-auto.px-4.py-8
  // Welcome section
  section.mb-8
    .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-6
      .flex.flex-col.md_flex-row.items-center.md_items-start
        .flex-shrink-0.mb-4.md_mb-0.md_mr-6
          img.h-24.w-24.rounded-full.border-2.border-gh-dark-border(
            :src="authStore.user?.photoUrl || 'https://github.com/identicons/' + authStore.user?.username + '.png'"
            alt="Profile"
          )
        .flex-grow
          h1.text-2xl.font-bold.text-gh-dark-fg.mb-1 Welcome to SocialTrail, {{ authStore.user?.username || 'User' }}!
          p.text-gh-dark-secondary.mb-4 Track your social contributions and earn points across platforms.
          .flex.flex-wrap.gap-2
            button.px-4.py-2.bg-gh-dark-primary.text-white.rounded-md.hover_bg-opacity-90.transition-colors
              i.fas.fa-plug.mr-2
              | Connect Platform
            button.px-4.py-2.bg-gh-dark-hover.text-gh-dark-fg.border.border-gh-dark-border.rounded-md.hover_bg-opacity-90.transition-colors
              i.fas.fa-user.mr-2
              | View Profile
  
  // Stats overview
  section.mb-8
    h2.text-xl.font-semibold.mb-4.text-gh-dark-fg Your Activity Overview
    .grid.grid-cols-1.md_grid-cols-4.gap-4
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4
        .text-gh-dark-secondary.text-sm Total Points
        .text-2xl.font-bold.text-gh-dark-fg 1,250
        .text-xs.text-green-500.flex.items-center.mt-1
          i.fas.fa-arrow-up.mr-1
          span +15% this week
      
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4
        .text-gh-dark-secondary.text-sm Platforms
        .text-2xl.font-bold.text-gh-dark-fg 3
        .text-xs.text-gh-dark-muted.mt-1 GitHub, X, Discord
      
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4
        .text-gh-dark-secondary.text-sm Contributions
        .text-2xl.font-bold.text-gh-dark-fg 47
        .text-xs.text-green-500.flex.items-center.mt-1
          i.fas.fa-arrow-up.mr-1
          span +8 this week
      
      .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.p-4
        .text-gh-dark-secondary.text-sm Rank
        .text-2xl.font-bold.text-gh-dark-fg #42
        .text-xs.text-green-500.flex.items-center.mt-1
          i.fas.fa-arrow-up.mr-1
          span +5 positions
  
  // Recent activity
  section.mb-8
    .flex.justify-between.items-center.mb-4
      h2.text-xl.font-semibold.text-gh-dark-fg Recent Activity
      button.text-gh-dark-primary.text-sm.hover_underline View All
    
    .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.overflow-hidden
      // Activity item
      .p-4.border-b.border-gh-dark-border
        .flex.items-start
          .mr-4.mt-1
            i.fab.fa-github.text-2xl.text-gh-dark-fg
          .flex-grow
            .flex.justify-between
              .font-medium.text-gh-dark-fg Opened a pull request
              .text-xs.text-gh-dark-muted 2 hours ago
            p.text-sm.text-gh-dark-secondary.mt-1 Fix navigation bug in dashboard component
            .mt-2.text-xs.text-gh-dark-primary repository/project
          .ml-4.text-sm.text-gh-dark-primary.font-bold +15 pts
      
      // Activity item
      .p-4.border-b.border-gh-dark-border
        .flex.items-start
          .mr-4.mt-1
            i.fab.fa-x-twitter.text-2xl.text-gh-dark-fg
          .flex-grow
            .flex.justify-between
              .font-medium.text-gh-dark-fg Posted a tweet
              .text-xs.text-gh-dark-muted 5 hours ago
            p.text-sm.text-gh-dark-secondary.mt-1 Just launched my new portfolio website! Check it out and let me know what you think.
            .mt-2.flex.items-center.text-xs.text-gh-dark-muted
              i.fas.fa-heart.mr-1
              span 12
              i.fas.fa-retweet.ml-3.mr-1
              span 3
          .ml-4.text-sm.text-gh-dark-primary.font-bold +10 pts
      
      // Activity item
      .p-4.border-b.border-gh-dark-border
        .flex.items-start
          .mr-4.mt-1
            i.fab.fa-discord.text-2xl.text-gh-dark-fg
          .flex-grow
            .flex.justify-between
              .font-medium.text-gh-dark-fg Helped a community member
              .text-xs.text-gh-dark-muted 1 day ago
            p.text-sm.text-gh-dark-secondary.mt-1 Answered a question about Vue.js component lifecycle hooks
            .mt-2.text-xs.text-gh-dark-primary Developer Community
          .ml-4.text-sm.text-gh-dark-primary.font-bold +5 pts
      
      // Activity item
      .p-4
        .flex.items-start
          .mr-4.mt-1
            i.fab.fa-github.text-2xl.text-gh-dark-fg
          .flex-grow
            .flex.justify-between
              .font-medium.text-gh-dark-fg Created an issue
              .text-xs.text-gh-dark-muted 2 days ago
            p.text-sm.text-gh-dark-secondary.mt-1 Feature request: Add dark mode toggle to user settings
            .mt-2.text-xs.text-gh-dark-primary repository/project
          .ml-4.text-sm.text-gh-dark-primary.font-bold +5 pts
  
  // Connected platforms
  section.mb-8
    h2.text-xl.font-semibold.mb-4.text-gh-dark-fg Connected Platforms
    .bg-gh-dark-subtle.rounded-lg.border.border-gh-dark-border.overflow-hidden
      // Platform
      .p-4.flex.items-center.justify-between.border-b.border-gh-dark-border
        .flex.items-center
          i.fab.fa-github.text-2xl.mr-3
          .text-gh-dark-fg GitHub
        .text-xs.px-2.py-1.rounded-full.bg-green-500.bg-opacity-20.text-green-500 Connected
      
      // Platform
      .p-4.flex.items-center.justify-between.border-b.border-gh-dark-border
        .flex.items-center
          i.fab.fa-x-twitter.text-2xl.mr-3
          .text-gh-dark-fg X
        .text-xs.px-2.py-1.rounded-full.bg-green-500.bg-opacity-20.text-green-500 Connected
      
      // Platform
      .p-4.flex.items-center.justify-between.border-b.border-gh-dark-border
        .flex.items-center
          i.fab.fa-discord.text-2xl.mr-3
          .text-gh-dark-fg Discord
        .text-xs.px-2.py-1.rounded-full.bg-green-500.bg-opacity-20.text-green-500 Connected
      
      // Platform
      .p-4.flex.items-center.justify-between.border-b.border-gh-dark-border
        .flex.items-center
          i.fab.fa-youtube.text-2xl.mr-3.text-gh-dark-muted
          .text-gh-dark-fg YouTube
        button.text-xs.px-2.py-1.rounded-full.bg-gh-dark-primary.text-white Connect
      
      // Platform
      .p-4.flex.items-center.justify-between
        .flex.items-center
          i.fab.fa-instagram.text-2xl.mr-3.text-gh-dark-muted
          .text-gh-dark-fg Instagram
        button.text-xs.px-2.py-1.rounded-full.bg-gh-dark-primary.text-white Connect
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  // Redirect to login if not authenticated
  if (!authStore.user) {
    router.push('/auth');
  }
});
</script> 