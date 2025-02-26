<template lang="pug">
.leaderboard
  h1.text-2xl.font-bold.mb-6 Leaderboard
  
  .bg-white.rounded-lg.shadow-md.overflow-hidden
    .loading.text-center.py-8(v-if="userStore.loading")
      p Loading leaderboard...
    
    table.min-w-full(v-else)
      thead.bg-gray-50
        tr
          th.py-3.px-6.text-left.text-xs.font-medium.text-gray-500.uppercase.tracking-wider Rank
          th.py-3.px-6.text-left.text-xs.font-medium.text-gray-500.uppercase.tracking-wider User
          th.py-3.px-6.text-left.text-xs.font-medium.text-gray-500.uppercase.tracking-wider Roles
          th.py-3.px-6.text-right.text-xs.font-medium.text-gray-500.uppercase.tracking-wider Points
      tbody.divide-y.divide-gray-200
        tr(v-for="(user, index) in userStore.leaderboard" :key="user.id")
          td.py-4.px-6.whitespace-nowrap
            .text-sm.font-medium.text-gray-900 {{ index + 1 }}
          td.py-4.px-6.whitespace-nowrap
            .text-sm.font-medium.text-gray-900 {{ user.username }}
          td.py-4.px-6.whitespace-nowrap
            .flex.flex-wrap.gap-1
              span.px-2.py-1.text-xs.rounded-full(
                v-for="role in user.roles"
                :key="role"
                :class="getRoleBadgeClass(role)"
              ) {{ role }}
          td.py-4.px-6.whitespace-nowrap.text-right
            .text-sm.font-medium.text-primary-600 {{ user.reputation }}
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { UserRole } from '@social-trail/common';

const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchLeaderboard();
});

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