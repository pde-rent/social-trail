<template lang="pug">
.register.max-w-md.mx-auto.mt-8
  .bg-white.rounded-lg.shadow-md.p-6
    h1.text-2xl.font-bold.mb-6 Create an Account
    
    .alert.bg-red-100.text-red-800.p-3.rounded-md.mb-4(v-if="authStore.error") {{ authStore.error }}
    
    form(@submit.prevent="register")
      .mb-4
        label.block.text-gray-700.mb-2(for="username") Username
        input#username.input.w-full(
          type="text"
          v-model="username"
          required
          placeholder="Choose a username"
        )
      
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
          placeholder="Create a password"
          minlength="8"
        )
      
      .flex.items-center.justify-between
        button.btn.btn-primary.w-full(
          type="submit"
          :disabled="authStore.loading"
        ) {{ authStore.loading ? 'Creating account...' : 'Register' }}
    
    .mt-4.text-center
      p.text-gray-600 Already have an account?
      router-link.text-primary-600.hover_text-primary-700(to="/login") Login here
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const username = ref('');
const email = ref('');
const password = ref('');

const register = async () => {
  await authStore.register(username.value, email.value, password.value);
};
</script> 