import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Pages
import Home from '../pages/Home.vue';
import Auth from '../pages/Auth.vue';
import Profile from '../pages/Profile.vue';
import Connect from '../pages/Connect.vue';
import Leaderboard from '../pages/Leaderboard.vue';
import AdminPanel from '../pages/AdminPanel.vue';
import NotFound from '../pages/NotFound.vue';
import Dashboard from '../pages/Dashboard.vue';
import Explore from '../pages/Explore.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: { guest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/connect',
    name: 'Connect',
    component: Connect,
    meta: { requiresAuth: true }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/explore',
    name: 'Explore',
    component: Explore
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Auth', query: { redirect: to.fullPath } });
      return;
    }
    
    // Check if route requires admin role
    if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (!authStore.isAdmin) {
        next({ name: 'Home' });
        return;
      }
    }
  }
  
  // Check if route is for guests only (like auth page)
  if (to.matched.some(record => record.meta.guest)) {
    if (authStore.isAuthenticated) {
      next({ name: 'Home' });
      return;
    }
  }
  
  next();
});

export default router; 