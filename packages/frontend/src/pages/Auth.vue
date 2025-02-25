<template lang="pug">
.flex.justify-center.items-center.min-h-screen.bg-gh-dark-bg.py-12.px-4.sm_px-6.lg_px-8
  .max-w-md.w-full.space-y-8
    .bg-gh-dark-subtle.p-8.rounded-lg.shadow-lg.border.border-gh-dark-border
      div
        h1.text-center.text-3xl.font-extrabold.text-gh-dark-fg SocialTrail
        p.mt-2.text-center.text-sm.text-gh-dark-secondary Track and manage your social presence
      
      .mt-8.space-y-4
        button.w-full.flex.items-center.justify-center.py-2.px-4.border.border-gh-dark-border.rounded-md.shadow-sm.text-sm.font-medium.text-gh-dark-fg.bg-gh-dark-subtle.hover_bg-gh-dark-hover.focus_outline-none.focus_ring-2.focus_ring-offset-2.focus_ring-gh-dark-primary.transition-colors(
          @click="signInWithGithub"
        )
          font-awesome-icon.text-xl.mr-3(icon="fa-brands fa-github")
          span Continue with GitHub
        
        button.w-full.flex.items-center.justify-center.py-2.px-4.border.border-gh-dark-border.rounded-md.shadow-sm.text-sm.font-medium.text-gh-dark-fg.bg-gh-dark-subtle.hover_bg-gh-dark-hover.focus_outline-none.focus_ring-2.focus_ring-offset-2.focus_ring-gh-dark-primary.transition-colors(
          @click="signInWithDiscord"
        )
          font-awesome-icon.text-xl.mr-3(icon="fa-brands fa-discord")
          span Continue with Discord
          
        button.w-full.flex.items-center.justify-center.py-2.px-4.border.border-gh-dark-border.rounded-md.shadow-sm.text-sm.font-medium.text-gh-dark-fg.bg-gh-dark-subtle.hover_bg-gh-dark-hover.focus_outline-none.focus_ring-2.focus_ring-offset-2.focus_ring-gh-dark-primary.transition-colors(
          @click="signInWithX"
        )
          font-awesome-icon.text-xl.mr-3(icon="fa-brands fa-x-twitter")
          span Continue with X

      .mt-6.text-center.text-xs.text-gh-dark-secondary
        | By continuing, you agree to our 
        a.text-gh-dark-primary.hover_text-opacity-80(href="/terms") Terms of Service
        |  and 
        a.text-gh-dark-primary.hover_text-opacity-80(href="/privacy") Privacy Policy
    
    // Error message
    .bg-red-900.bg-opacity-20.border.border-red-700.border-opacity-50.rounded-md.p-4.mt-4(v-if="authStore.error")
      .flex
        .flex-shrink-0
          font-awesome-icon.text-red-500(icon="fa-solid fa-exclamation-circle")
        .ml-3
          p.text-sm.text-red-400 {{ authStore.error }}
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Get redirect path from query params or default to home
const redirectPath = route.query.redirect?.toString() || '/';

const signInWithGithub = async () => {
  try {
    await authStore.signInWithOAuth('github');
    router.push(redirectPath);
  } catch (error) {
    console.error('GitHub authentication failed:', error);
  }
};

const signInWithDiscord = async () => {
  try {
    await authStore.signInWithOAuth('discord');
    router.push(redirectPath);
  } catch (error) {
    console.error('Discord authentication failed:', error);
  }
};

const signInWithX = async () => {
  try {
    await authStore.signInWithOAuth('x');
    router.push(redirectPath);
  } catch (error) {
    console.error('X authentication failed:', error);
  }
};
</script> 