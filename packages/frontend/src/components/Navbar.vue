<template lang="pug">
nav.bg-gray-800.text-white.p-4
  .container.mx-auto.flex.justify-between.items-center
    // Logo/Brand
    router-link.text-xl.font-bold(to="/") SocialTrail
    
    // Navigation Links
    .flex.space-x-4
      router-link.px-3.py-2.rounded.hover_bg-gray-700(to="/") Home
      router-link.px-3.py-2.rounded.hover_bg-gray-700(to="/leaderboard") Leaderboard
      
      // Authenticated links
      template(v-if="authStore.isAuthenticated")
        router-link.px-3.py-2.rounded.hover_bg-gray-700(to="/profile") Profile
        router-link.px-3.py-2.rounded.hover_bg-gray-700(to="/connect") Connect
        
        // Admin links
        router-link.px-3.py-2.rounded.hover_bg-gray-700(
          v-if="authStore.isAdmin"
          to="/admin"
        ) Admin
        
        // Logout button
        button.px-3.py-2.rounded.hover_bg-gray-700(
          @click="logout"
        ) Logout
      
      // Guest links
      router-link.px-3.py-2.rounded.hover_bg-gray-700(
        v-else
        to="/auth"
      ) Sign In
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.push('/');
};
</script> 