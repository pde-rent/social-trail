import { defineStore } from 'pinia';
import axios from 'axios';
import { type Activity, ActivityType, SocialPlatform } from '@contribution-tracker/common';

interface ActivityState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

export const useActivityStore = defineStore('activity', {
  state: (): ActivityState => ({
    activities: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchUserActivities() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('/api/activity/user');
        
        if (response.data.success) {
          this.activities = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to fetch activities';
        console.error('Fetch activities error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async recordActivity(platform: SocialPlatform, type: ActivityType, metadata: Record<string, any> = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/activity/record', {
          platform,
          type,
          metadata
        });
        
        if (response.data.success) {
          // Add new activity to the list
          this.activities.unshift(response.data.data);
        }
        
        return response.data.success;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to record activity';
        console.error('Record activity error:', error);
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
}); 