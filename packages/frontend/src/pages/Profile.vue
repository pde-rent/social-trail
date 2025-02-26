<template lang="pug">
.profile(v-if="authStore.user")
  .grid.grid-cols-1.md_grid-cols-3.gap-8
    .col-span-1
      .bg-white.rounded-lg.shadow-md.p-6.mb-6
        .flex.items-center.mb-4
          .avatar.bg-primary-100.text-primary-700.rounded-full.w-16.h-16.flex.items-center.justify-center.text-2xl.font-bold.mr-4 {{ userInitials }}
          div
            h1.text-2xl.font-bold {{ authStore.user.username }}
            p.text-gray-600 {{ authStore.user.email }}
        
        .stats.flex.justify-between.py-3.border-t.border-gray-200
          .stat
            p.text-gray-600 Reputation
            p.text-2xl.font-bold.text-primary-600 {{ authStore.user.reputation }}
          
          .stat
            p.text-gray-600 Activities
            p.text-2xl.font-bold {{ activityStore.activities.length }}
      
      .bg-white.rounded-lg.shadow-md.p-6
        h2.text-xl.font-bold.mb-4 Edit Profile
        
        form(@submit.prevent="updateProfile")
          .mb-4
            label.block.text-gray-700.mb-2(for="username") Username
            input#username.input.w-full(
              type="text"
              v-model="profileForm.username"
              required
            )
          
          .mb-4
            label.block.text-gray-700.mb-2(for="bio") Bio
            textarea#bio.input.w-full(
              v-model="profileForm.bio"
              rows="3"
            )
          
          button.btn.btn-primary.w-full(
            type="submit"
            :disabled="userStore.loading"
          ) {{ userStore.loading ? 'Saving...' : 'Save Changes' }}
    
    .col-span-2
      .bg-white.rounded-lg.shadow-md.p-6.mb-6
        h2.text-xl.font-bold.mb-4 Recent Activity
        
        .loading.text-center.py-4(v-if="activityStore.loading")
          p Loading activities...
        
        .no-activities.text-center.py-4(v-else-if="!activityStore.activities.length")
          p No activities yet. Connect your social accounts to start tracking.
        
        .activities(v-else)
          ActivityCard.mb-4(
            v-for="activity in activityStore.activities"
            :key="activity.id"
            :activity="activity"
          )
      
      .bg-white.rounded-lg.shadow-md.p-6
        h2.text-xl.font-bold.mb-4 Record Activity
        
        form(@submit.prevent="recordActivity")
          .mb-4
            label.block.text-gray-700.mb-2(for="platform") Platform
            select#platform.input.w-full(v-model="activityForm.platform" required)
              option(v-for="platform in platforms" :value="platform") {{ platformNames[platform] }}
          
          .mb-4
            label.block.text-gray-700.mb-2(for="type") Activity Type
            select#type.input.w-full(v-model="activityForm.type" required)
              option(v-for="type in activityTypes" :value="type") {{ activityTypeNames[type] }}
          
          .mb-4
            label.block.text-gray-700.mb-2(for="content") Content/Description
            textarea#content.input.w-full(
              v-model="activityForm.content"
              rows="3"
              placeholder="Describe your activity"
            )
          
          button.btn.btn-primary.w-full(
            type="submit"
            :disabled="activityStore.loading"
          ) {{ activityStore.loading ? 'Recording...' : 'Record Activity' }}
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user';
import { useActivityStore } from '../stores/activity';
import { SocialPlatform, ActivityType } from '@social-trail/common';
import ActivityCard from '../components/ActivityCard.vue';

const authStore = useAuthStore();
const userStore = useUserStore();
const activityStore = useActivityStore();

const userInitials = computed(() => {
  if (!authStore.user?.username) return '';
  return authStore.user.username.substring(0, 2).toUpperCase();
});

const profileForm = ref({
  username: authStore.user?.username || '',
  bio: ''
});

const activityForm = ref({
  platform: SocialPlatform.X,
  type: ActivityType.POST,
  content: ''
});

const platforms = Object.values(SocialPlatform);
const activityTypes = Object.values(ActivityType);

const platformNames: Record<SocialPlatform, string> = {
  [SocialPlatform.X]: 'X (Twitter)',
  [SocialPlatform.YOUTUBE]: 'YouTube',
  [SocialPlatform.TIKTOK]: 'TikTok',
  [SocialPlatform.INSTAGRAM]: 'Instagram',
  [SocialPlatform.DISCORD]: 'Discord',
  [SocialPlatform.GITHUB]: 'GitHub',
  [SocialPlatform.TELEGRAM]: 'Telegram',
  [SocialPlatform.EVM]: 'Ethereum'
};

const activityTypeNames: Record<ActivityType, string> = {
  [ActivityType.POST]: 'Post',
  [ActivityType.COMMENT]: 'Comment',
  [ActivityType.LIKE]: 'Like',
  [ActivityType.SHARE]: 'Share',
  [ActivityType.FOLLOW]: 'Follow',
  [ActivityType.CONTRIBUTION]: 'Contribution',
  [ActivityType.CODE_COMMIT]: 'Code Commit'
};

onMounted(async () => {
  await activityStore.fetchUserActivities();
});

const updateProfile = async () => {
  const success = await userStore.updateProfile(
    profileForm.value.username,
    profileForm.value.bio
  );
  
  if (success) {
    await authStore.fetchUser();
  }
};

const recordActivity = async () => {
  const metadata: Record<string, any> = {
    content: activityForm.value.content
  };
  
  const success = await activityStore.recordActivity(
    activityForm.value.platform,
    activityForm.value.type,
    metadata
  );
  
  if (success) {
    activityForm.value.content = '';
    await authStore.fetchUser(); // Refresh user to get updated reputation
  }
};
</script> 