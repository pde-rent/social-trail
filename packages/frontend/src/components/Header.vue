<template lang="pug">
header.bg-gh-dark-subtle.border-b.border-gh-dark-border.sticky.top-0.z-10
  .max-w-7xl.mx-auto.px-4.sm_px-6.lg_px-8
    .flex.justify-between.h-16
      .flex.items-center
        .flex-shrink-0.flex.items-center
          router-link.flex.items-center.gap-2(to="/")
            .logo-container.h-8.w-8.overflow-hidden
              svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1152 727" fill="none")
                path(fill="currentColor" d="M945 673C716 809-206 651 42 601c400-82 646-118 566-222C526 273-566 68 823 0c-1035 168 95 168 290 363 87 87 25 195-168 310Z")
            span.text-gh-dark-fg.font-semibold.text-lg.hidden.md_block SocialTrail
        
        nav.ml-6.hidden.md_flex.space-x-4
          router-link.px-3.py-2.rounded-md.text-sm.font-medium(
            to="/"
            :class="[$route.path === '/' ? 'bg-gh-dark-hover text-gh-dark-fg' : 'text-gh-dark-secondary hover_bg-gh-dark-hover hover_text-gh-dark-fg']"
          ) Dashboard
          
          router-link.px-3.py-2.rounded-md.text-sm.font-medium(
            to="/explore"
            :class="[$route.path === '/explore' ? 'bg-gh-dark-hover text-gh-dark-fg' : 'text-gh-dark-secondary hover_bg-gh-dark-hover hover_text-gh-dark-fg']"
          ) Explore
      
      .flex.items-center
        // Search bar
        .hidden.md_block.mr-4
          .relative.rounded-md.shadow-sm
            input.block.w-full.py-2.pl-10.pr-3.bg-gh-dark-bg.border.border-gh-dark-border.rounded-md.focus_outline-none.focus_ring-1.focus_ring-gh-dark-primary.focus_border-gh-dark-primary.text-gh-dark-fg.placeholder-gh-dark-muted(
              type="search"
              placeholder="Search..."
            )
            .absolute.inset-y-0.left-0.pl-3.flex.items-center.pointer-events-none
              font-awesome-icon(icon="fa-solid fa-search" class="text-gh-dark-muted")
        
        // User menu (if authenticated)
        .ml-4.relative.flex-shrink-0(v-if="authStore.isAuthenticated")
          button.bg-gh-dark-bg.flex.text-sm.rounded-full.focus_outline-none.focus_ring-2.focus_ring-offset-2.focus_ring-gh-dark-primary(
            @click="isProfileMenuOpen = !isProfileMenuOpen"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
          )
            span.sr-only Open user menu
            img.h-8.w-8.rounded-full(
              :src="authStore.user?.photoUrl || 'https://github.com/identicons/' + authStore.user?.username + '.png'"
              alt="User profile"
            )
          
          // Dropdown menu
          .origin-top-right.absolute.right-0.mt-2.w-48.rounded-md.shadow-lg.py-1.bg-gh-dark-subtle.border.border-gh-dark-border.focus_outline-none(
            v-if="isProfileMenuOpen"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabindex="-1"
          )
            router-link.block.px-4.py-2.text-sm.text-gh-dark-fg.hover_bg-gh-dark-hover(
              to="/profile"
              role="menuitem"
              tabindex="-1"
              @click="isProfileMenuOpen = false"
            ) Your Profile
            
            router-link.block.px-4.py-2.text-sm.text-gh-dark-fg.hover_bg-gh-dark-hover(
              to="/dashboard"
              role="menuitem"
              tabindex="-1"
              @click="isProfileMenuOpen = false"
            ) Dashboard
            
            router-link.block.px-4.py-2.text-sm.text-gh-dark-fg.hover_bg-gh-dark-hover(
              to="/connect"
              role="menuitem"
              tabindex="-1"
              @click="isProfileMenuOpen = false"
            ) Connect Platforms
            
            a.block.px-4.py-2.text-sm.text-gh-dark-fg.hover_bg-gh-dark-hover(
              href="#"
              role="menuitem"
              tabindex="-1"
              @click="logout"
            ) Disconnect
        
        // Login button (if not authenticated)
        template(v-else)
          router-link.inline-flex.items-center.px-4.py-2.border.border-transparent.text-sm.font-medium.rounded-md.shadow-sm.text-white.bg-gh-dark-primary.hover_bg-opacity-90.focus_outline-none.focus_ring-2.focus_ring-offset-2.focus_ring-gh-dark-primary(
            to="/auth"
          ) Connect
        
        // Mobile menu button
        .ml-2.flex.md_hidden
          button.bg-gh-dark-hover.p-2.rounded-md.inline-flex.items-center.justify-center.text-gh-dark-fg.hover_text-white.hover_bg-gh-dark-hover.focus_outline-none.focus_ring-2.focus_ring-inset.focus_ring-white(
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-expanded="false"
          )
            span.sr-only Open main menu
            font-awesome-icon(v-if="!isMobileMenuOpen" icon="fa-solid fa-bars")
            font-awesome-icon(v-else icon="fa-solid fa-times")
  
  // Mobile menu
  .md_hidden(v-if="isMobileMenuOpen")
    .px-2.pt-2.pb-3.space-y-1.sm_px-3.bg-gh-dark-subtle.border-b.border-gh-dark-border
      router-link.block.px-3.py-2.rounded-md.text-base.font-medium(
        to="/"
        :class="[$route.path === '/' ? 'bg-gh-dark-hover text-gh-dark-fg' : 'text-gh-dark-secondary hover_bg-gh-dark-hover hover_text-gh-dark-fg']"
        @click="isMobileMenuOpen = false"
      ) Dashboard
      
      router-link.block.px-3.py-2.rounded-md.text-base.font-medium(
        to="/explore"
        :class="[$route.path === '/explore' ? 'bg-gh-dark-hover text-gh-dark-fg' : 'text-gh-dark-secondary hover_bg-gh-dark-hover hover_text-gh-dark-fg']"
        @click="isMobileMenuOpen = false"
      ) Explore
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isProfileMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);

const logout = async () => {
  await authStore.logout();
  isProfileMenuOpen.value = false;
  router.push('/auth');
};
</script> 