<template lang="pug">
.login.max-w-md.mx-auto.mt-8
  .bg-white.rounded-lg.shadow-md.p-6
    h1.text-2xl.font-bold.mb-6 Login
    
    .alert.bg-red-100.text-red-800.p-3.rounded-md.mb-4(v-if="authStore.error") {{ authStore.error }}
    
    form(@submit.prevent="login")
      .mb-4
        label.block.text-gray-700.mb-2(for="email") Email
        input#email.input.w-full(
          type="email"
          v-model="email"
          required
          placeholder="Enter your email"
        )
      
      .mb-6
        label.block.text-gray-700.mb-2(for="password") Password
        input#password.input.w-full(
          type="password"
          v-model="password"
          required
          placeholder="Enter your password"
        )
      
      .flex.items-center.justify-between
        button.btn.btn-primary.w-full(
          type="submit"
          :disabled="authStore.loading"
        ) {{ authStore.loading ? 'Logging in...' : 'Login' }}
    
    .mt-4.text-center
      p.text-gray-600 Don't have an account?
      router-link.text-primary-600.hover_text-primary-700(to="/register") Register here
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const login = async () => {
  await authStore.login(email.value, password.value);
};
</script> 