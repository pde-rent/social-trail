<template lang="pug">
.platform-connector.bg-white.rounded-lg.shadow-md.p-4.border.border-gray-200
  .flex.items-center.justify-between
    .flex.items-center
      img.w-10.h-10.mr-3(:src="platformIcon" :alt="platform")
      div
        h3.font-medium {{ platformName }}
        p.text-sm.text-gray-600(v-if="connected") Connected as {{ handle }}
        p.text-sm.text-gray-600(v-else) Not connected
    
    button.btn(
      :class="connected ? 'btn-secondary' : 'btn-primary'",
      @click="connected ? disconnect() : connect()"
    ) {{ connected ? 'Disconnect' : 'Connect' }}
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SocialPlatform } from '@social-trail/common';

const props = defineProps<{
  platform: SocialPlatform;
  connected: boolean;
  handle?: string;
}>();

const emit = defineEmits<{
  (e: 'connect', platform: SocialPlatform): void;
  (e: 'disconnect', platform: SocialPlatform): void;
}>();

const platformIcon = computed(() => {
  // In a real app, use actual platform icons
  const icons: Record<SocialPlatform, string> = {
    [SocialPlatform.X]: '/icons/x.png',
    [SocialPlatform.YOUTUBE]: '/icons/youtube.png',
    [SocialPlatform.TIKTOK]: '/icons/tiktok.png',
    [SocialPlatform.INSTAGRAM]: '/icons/instagram.png',
    [SocialPlatform.DISCORD]: '/icons/discord.png',
    [SocialPlatform.GITHUB]: '/icons/github.png',
    [SocialPlatform.TELEGRAM]: '/icons/telegram.png',
    [SocialPlatform.EVM]: '/icons/ethereum.png'
  };
  
  return icons[props.platform] || '/icons/default.png';
});

const platformName = computed(() => {
  const names: Record<SocialPlatform, string> = {
    [SocialPlatform.X]: 'X (Twitter)',
    [SocialPlatform.YOUTUBE]: 'YouTube',
    [SocialPlatform.TIKTOK]: 'TikTok',
    [SocialPlatform.INSTAGRAM]: 'Instagram',
    [SocialPlatform.DISCORD]: 'Discord',
    [SocialPlatform.GITHUB]: 'GitHub',
    [SocialPlatform.TELEGRAM]: 'Telegram',
    [SocialPlatform.EVM]: 'Ethereum'
  };
  
  return names[props.platform];
});

const connect = () => {
  emit('connect', props.platform);
};

const disconnect = () => {
  emit('disconnect', props.platform);
};
</script> 