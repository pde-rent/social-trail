import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import './assets/tailwind.css';
import './assets/custom.css';

// Import Font Awesome core
import { library } from '@fortawesome/fontawesome-svg-core';
// Import Font Awesome component
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// Import specific icons
import { faPlug, faChartLine, faAward, faSearch, faBars, faTimes, faUser, faExclamationCircle, faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faDiscord, faXTwitter, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

// Import styles
import './assets/css/main.css';

// Add icons to library
library.add(
  // Solid icons
  faPlug, faChartLine, faAward, faSearch, faBars, faTimes, faUser, faExclamationCircle, faHeart, faComment,
  // Brand icons
  faGithub, faDiscord, faXTwitter, faYoutube, faInstagram
);

// Set up axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Create app
const app = createApp(App);

// Use plugins
app.use(createPinia());
app.use(router);

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon);

// Mount app
app.mount('#app'); 