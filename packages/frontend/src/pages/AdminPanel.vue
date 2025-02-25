<template lang="pug">
.admin-panel
  h1.text-2xl.font-bold.mb-6 Admin Panel
  
  .grid.grid-cols-1.md_grid-cols-2.gap-8
    .bg-white.rounded-lg.shadow-md.p-6
      h2.text-xl.font-bold.mb-4 Pending Activities
      
      .loading.text-center.py-4(v-if="loading")
        p Loading activities...
      
      .no-activities.text-center.py-4(v-else-if="!pendingActivities.length")
        p No pending activities to verify.
      
      .activities(v-else)
        .activity.border.border-gray-200.rounded-md.p-4.mb-4(
          v-for="activity in pendingActivities"
          :key="activity.id"
        )
          .flex.justify-between.items-start
            div
              p.font-medium User: {{ activity.userId }}
              p.text-sm.text-gray-600 Platform: {{ activity.platform }}
              p.text-sm.text-gray-600 Type: {{ activity.type }}
              p.text-sm.text-gray-600 Points: {{ activity.points }}
              p.text-sm.text-gray-600 Timestamp: {{ formatDate(activity.timestamp) }}
            
            button.btn.btn-primary(@click="verifyActivity(activity.id)") Verify
    
    .bg-white.rounded-lg.shadow-md.p-6
      h2.text-xl.font-bold.mb-4 User Management
      
      .loading.text-center.py-4(v-if="userStore.loading")
        p Loading users...
      
      .users(v-else)
        .user.border.border-gray-200.rounded-md.p-4.mb-4(
          v-for="user in userStore.leaderboard"
          :key="user.id"
        )
          p.font-medium {{ user.username }}
          p.text-sm.text-gray-600 ID: {{ user.id }}
          p.text-sm.text-gray-600 Reputation: {{ user.reputation }}
          
          .mt-2
            .flex.flex-wrap.gap-1.mb-2
              span.px-2.py-1.text-xs.rounded-full(
                v-for="role in user.roles"
                :key="role"
                :class="getRoleBadgeClass(role)"
              ) {{ role }}
            
            .flex.gap-2.mt-2
              button.btn.btn-secondary.text-xs.py-1(@click="viewUserActivities(user.id)") View Activities
              button.btn.btn-primary.text-xs.py-1(@click="editUserRoles(user.id)") Edit Roles
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { UserRole, formatDate } from '@contribution-tracker/common';
import axios from 'axios';

const userStore = useUserStore();
const loading = ref(false);
const pendingActivities = ref([]);

onMounted(async () => {
  await userStore.fetchLeaderboard();
  await fetchPendingActivities();
});

const fetchPendingActivities = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/activity/pending');
    
    if (response.data.success) {
      pendingActivities.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch pending activities:', error);
  } finally {
    loading.value = false;
  }
};

const verifyActivity = async (activityId: string) => {
  try {
    const response = await axios.post(`/api/activity/verify/${activityId}`);
    
    if (response.data.success) {
      // Remove from pending activities
      pendingActivities.value = pendingActivities.value.filter(
        (activity: any) => activity.id !== activityId
      );
    }
  } catch (error) {
    console.error(`Failed to verify activity ${activityId}:`, error);
  }
};

const viewUserActivities = async (userId: string) => {
  // Navigate to user activities page or show modal
  console.log(`View activities for user ${userId}`);
};

const editUserRoles = async (userId: string) => {
  // Show modal to edit user roles
  console.log(`Edit roles for user ${userId}`);
};

const getRoleBadgeClass = (role: UserRole) => {
  const classes = {
    [UserRole.ADMIN]: 'bg-red-100 text-red-800',
    [UserRole.ARTIST]: 'bg-purple-100 text-purple-800',
    [UserRole.COPYWRITER]: 'bg-blue-100 text-blue-800',
    [UserRole.CODER]: 'bg-green-100 text-green-800',
    [UserRole.ECONOMIST]: 'bg-yellow-100 text-yellow-800',
    [UserRole.DEFAULT]: 'bg-gray-100 text-gray-800'
  };
  
  return classes[role] || classes[UserRole.DEFAULT];
};
</script> 