<template lang="pug">
.connect
  h1.text-2xl.font-bold.mb-6 Connect Social Platforms
  
  .grid.grid-cols-1.gap-4
    PlatformConnector(
      v-for="platform in platforms"
      :key="platform"
      :platform="platform"
      :connected="isConnected(platform)"
      :handle="getHandle(platform)"
      @connect="connectPlatform"
      @disconnect="disconnectPlatform"
    )
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { SocialPlatform } from '@social-trail/common';
import PlatformConnector from '../components/PlatformConnector.vue';
import axios from 'axios';

const authStore = useAuthStore();
const platforms = Object.values(SocialPlatform);
const connectedPlatforms = ref<Record<SocialPlatform, string>>({} as Record<SocialPlatform, string>);

onMounted(async () => {
  await fetchConnectedPlatforms();
});

const fetchConnectedPlatforms = async () => {
  try {
    const response = await axios.get('/api/users/profile');
    
    if (response.data.success && response.data.data.socialHandles) {
      connectedPlatforms.value = response.data.data.socialHandles;
    }
  } catch (error) {
    console.error('Failed to fetch connected platforms:', error);
  }
};

const isConnected = (platform: SocialPlatform) => {
  return !!connectedPlatforms.value[platform];
};

const getHandle = (platform: SocialPlatform) => {
  return connectedPlatforms.value[platform] || '';
};

const connectPlatform = (platform: SocialPlatform) => {
  // Redirect to OAuth flow
  window.location.href = `/api/oauth/connect/${platform}`;
};

const disconnectPlatform = async (platform: SocialPlatform) => {
  try {
    const response = await axios.delete(`/api/oauth/${platform}`);
    
    if (response.data.success) {
      // Remove from connected platforms
      const newConnectedPlatforms = { ...connectedPlatforms.value };
      delete newConnectedPlatforms[platform];
      connectedPlatforms.value = newConnectedPlatforms;
    }
  } catch (error) {
    console.error(`Failed to disconnect ${platform}:`, error);
  }
};
</script> 