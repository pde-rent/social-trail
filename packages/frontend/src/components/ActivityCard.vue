<template lang="pug">
.bg-white.rounded-lg.shadow-md.p-4.border.border-gray-200
  .flex.items-start
    .platform-icon.mr-3
      img.w-10.h-10.rounded-full(:src="platformIcon" :alt="activity.platform")
    
    .flex-grow
      .flex.items-center.justify-between
        h3.font-medium {{ activityTitle }}
        span.text-sm.text-gray-500 {{ formatDate(activity.timestamp) }}
      
      p.text-gray-600.mt-1 {{ activityDescription }}
      
      .mt-2.flex.items-center.justify-between
        span.text-primary-600.font-medium +{{ activity.points }} points
        span.text-xs.px-2.py-1.rounded-full(
          :class="activity.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
        ) {{ activity.verified ? 'Verified' : 'Pending' }}
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type Activity, ActivityType, SocialPlatform } from '@social-trail/common';
import { formatDate } from '@social-trail/common';

const props = defineProps<{
  activity: Activity;
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
  
  return icons[props.activity.platform] || '/icons/default.png';
});

const activityTitle = computed(() => {
  const titles: Record<ActivityType, string> = {
    [ActivityType.POST]: 'Created a post',
    [ActivityType.COMMENT]: 'Left a comment',
    [ActivityType.LIKE]: 'Liked content',
    [ActivityType.SHARE]: 'Shared content',
    [ActivityType.FOLLOW]: 'Followed someone',
    [ActivityType.CONTRIBUTION]: 'Made a contribution',
    [ActivityType.CODE_COMMIT]: 'Committed code'
  };
  
  return titles[props.activity.type];
});

const activityDescription = computed(() => {
  const { metadata } = props.activity;
  
  switch (props.activity.type) {
    case ActivityType.POST:
      return `Posted on ${props.activity.platform}: "${metadata.content?.substring(0, 50)}${metadata.content?.length > 50 ? '...' : ''}"`;
    case ActivityType.COMMENT:
      return `Commented: "${metadata.content?.substring(0, 50)}${metadata.content?.length > 50 ? '...' : ''}"`;
    case ActivityType.LIKE:
      return `Liked ${metadata.contentType || 'content'} by ${metadata.creator || 'someone'}`;
    case ActivityType.SHARE:
      return `Shared ${metadata.contentType || 'content'} by ${metadata.creator || 'someone'}`;
    case ActivityType.FOLLOW:
      return `Followed ${metadata.target || 'someone'} on ${props.activity.platform}`;
    case ActivityType.CONTRIBUTION:
      return `Contributed to ${metadata.project || 'a project'}: ${metadata.description || ''}`;
    case ActivityType.CODE_COMMIT:
      return `Committed to ${metadata.repository || 'a repository'}: ${metadata.message?.substring(0, 50) || ''}`;
    default:
      return 'Performed an activity';
  }
});
</script> 