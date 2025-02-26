import { defineStore } from 'pinia';
import axios from 'axios';
import { type User, UserRole } from '@social-trail/common';
import router from '../router';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.roles.includes(UserRole.ADMIN) || false
  },
  
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/auth/login', { email, password });
        
        if (response.data.success) {
          const { token, user } = response.data.data;
          
          this.token = token;
          this.user = user;
          
          localStorage.setItem('token', this.token || '');
          
          // Set default Authorization header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Redirect to home or intended page
          const redirect = router.currentRoute.value.query.redirect as string;
          router.push(redirect || '/');
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to login';
        console.error('Login error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async register(username: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/auth/register', {
          username,
          email,
          password
        });
        
        if (response.data.success) {
          // Redirect to login page after successful registration
          router.push('/login');
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to register';
        console.error('Registration error:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      try {
        await axios.post('/api/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear user data regardless of API response
        this.user = null;
        this.token = null;
        
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        
        router.push('/login');
      }
    },
    
    async fetchUser() {
      if (!this.token) return;
      
      this.loading = true;
      
      try {
        // Set Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
        const response = await axios.get('/api/users/profile');
        
        if (response.data.success) {
          this.user = response.data.data;
        }
      } catch (error: any) {
        console.error('Fetch user error:', error);
        
        // If token is invalid, logout
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },
    
    init() {
      if (this.token) {
        this.fetchUser();
      }
    },
    
    async signInWithOAuth(provider: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Open popup window
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        const popup = window.open(
          `${import.meta.env.VITE_API_URL}/auth/${provider}`,
          'oauth',
          `width=${width},height=${height},left=${left},top=${top}`
        );
        
        if (!popup) {
          throw new Error('Could not open popup window. Please check your popup blocker settings.');
        }
        
        // Handle the OAuth response
        return new Promise((resolve, reject) => {
          const handleMessage = (event: MessageEvent) => {
            // Verify origin
            if (event.origin !== import.meta.env.VITE_API_URL) {
              return;
            }
            
            if (event.data.token && event.data.user) {
              this.token = event.data.token;
              this.user = event.data.user;
              
              // Store token
              localStorage.setItem('token', this.token || '');
              
              // Set Authorization header
              axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
              
              window.removeEventListener('message', handleMessage);
              popup.close();
              this.loading = false;
              resolve(this.user);
            } else if (event.data.error) {
              window.removeEventListener('message', handleMessage);
              popup.close();
              this.error = event.data.error;
              this.loading = false;
              reject(new Error(event.data.error));
            }
          };
          
          window.addEventListener('message', handleMessage);
          
          // Handle popup being closed
          const checkClosed = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkClosed);
              window.removeEventListener('message', handleMessage);
              this.loading = false;
              reject(new Error('Authentication cancelled'));
            }
          }, 1000);
        });
      } catch (error: any) {
        this.error = error.message;
        this.loading = false;
        throw error;
      }
    },
  }
});
