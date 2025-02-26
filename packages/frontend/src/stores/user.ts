import { defineStore } from 'pinia';
import axios from 'axios';
import { type User } from '@social-trail/common';

interface UserState {
  leaderboard: User[];
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    leaderboard: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchLeaderboard() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/api/users/leaderboard');
        
        if (response.data.success) {
          this.leaderboard = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to fetch leaderboard';
        console.error('Fetch leaderboard error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async updateProfile(username: string, bio: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put('/api/users/profile', {
          username,
          bio
        });
        
        return response.data.success;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to update profile';
        console.error('Update profile error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
}); 