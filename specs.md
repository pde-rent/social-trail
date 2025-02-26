# SocialTrail - Application Specifications

## Overview
SocialTrail is an application designed to track users' social activity across multiple platforms, allowing them to earn points when engaging with content on X, YouTube, TikTok, Instagram, and other platforms.

## Architecture
The application follows a monorepo structure with shared code between frontend and backend.

### Tech Stack
- **Backend**: Bun.js with Redis for caching and persistence
- **Frontend**: Vue.js with Pug templating and Tailwind CSS
- **Common**: Shared TypeScript code (types, utilities)

## Backend Specifications

### Database Structure
Redis will be used as a lightweight database to store:
- User profiles
- OAuth tokens
- Social media activity
- Reputation points

### User Roles
Each user can have one or more of the following roles:
- Admin: Full system access
- Artist (contributor): Content creation
- Copywriter (contributor): Text content
- Coder (contributor): Technical contributions
- Economist (contributor): Financial analysis
- Default (contributor): Basic contributor role

### API Endpoints

#### Authentication
- `POST /auth/login`: Authenticate user
- `POST /auth/logout`: End user session
- `POST /auth/verify`: Verify user token

#### OAuth Integration
- `GET /oauth/connect/:platform`: Initiate OAuth flow for a platform
- `GET /oauth/callback/:platform`: Handle OAuth callback

#### User Management
- `GET /users/:handle/exists`: Check if a user exists by social handle
- `GET /users/:handle/reputation`: Get user reputation points by social handle
- `GET /users/:userId/social-handles`: Get all social handles for a user (admin only)
- `POST /users/verify-signature`: Validate a user signature against any social handle

#### Activity Tracking
- `POST /activity/record`: Record user activity
- `GET /activity/user/:userId`: Get user activity history
- `GET /leaderboard`: Get reputation leaderboard

### Environment Configuration
Required environment variables:
- `INITIAL_ADMIN`: First admin user identifier
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT tokens
- OAuth credentials for each platform:
  - X_CLIENT_ID, X_CLIENT_SECRET
  - DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
  - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
  - TELEGRAM_BOT_TOKEN
  - TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET
  - INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET
  - YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET

## Frontend Specifications

### Pages
- **Home**: Dashboard with activity overview
- **Profile**: User profile and stats
- **Connect**: Link social accounts
- **Leaderboard**: Top contributors
- **Admin Panel**: For admin users only

### Features
- OAuth connection flow for all supported platforms:
  - X
  - Discord
  - GitHub
  - Telegram
  - TikTok
  - Instagram
  - YouTube
  - EVM (Ethereum, etc.)
- Activity feed showing recent contributions
- Reputation points display
- Role-based UI elements

### Authentication
- Web3 wallet connection for EVM accounts
- OAuth-based login for social platforms
- Session management

## Common Code (Shared)

### Types
- User interfaces
- Activity interfaces
- Platform-specific types
- Response types

### Utilities
- Formatting helpers
- Mathematical calculations for reputation
- Type reflection utilities
- Date/time handling
- Validation functions

## Development Workflow
1. Set up monorepo structure
2. Implement shared types and utilities
3. Develop backend API endpoints
4. Create frontend components and pages
5. Integrate OAuth providers
6. Implement activity tracking logic
7. Add admin functionality
8. Deploy and test

## Security Considerations
- Secure storage of OAuth tokens
- Rate limiting on API endpoints
- Input validation
- Role-based access control
- Signature verification for sensitive operations

## Repository Structure
social-trail/
├── package.json
└── packages/
   ├── common/
   │   ├── package.json
   │   ├── tsconfig.json
   │   └── src/
   │       ├── index.ts
   │       ├── types/
   │       │   ├── activity.ts
   │       │   ├── user.ts
   │       │   └── index.ts
   │       └── utils/
   │           ├── formatters.ts
   │           └── index.ts
   ├── backend/
   │   ├── package.json
   │   ├── tsconfig.json
   │   └── src/
   │       ├── index.ts
   │       ├── config/
   │       │   └── env.ts
   │       ├── db/
   │       │   └── redis.ts
   │       ├── middleware/
   │       │   └── auth.ts
   │       ├── routes/
   │       │   ├── activity.ts
   │       │   ├── auth.ts
   │       │   ├── oauth.ts
   │       │   └── users.ts
   │       └── services/
   │           ├── activityService.ts
   │           ├── authService.ts
   │           ├── oauthService.ts
   │           └── userService.ts
   └── frontend/
       ├── index.html
       ├── package.json
       ├── postcss.config.js
       ├── tailwind.config.js
       ├── tsconfig.json
       ├── vite.config.ts
       └── src/
           ├── main.ts
           ├── App.vue
           ├── shims-vue.d.ts
           ├── assets/
           │   └── css/
           │       └── main.css
           └── icons/
               ├── x.png
               ├── youtube.png
               ├── tiktok.png
               └── ...
           ├── components/
           │   ├── ActivityCard.vue
           │   ├── Footer.vue
           │   ├── Navbar.vue
           │   └── PlatformConnector.vue
           ├── pages/
           │   ├── AdminPanel.vue
           │   ├── Connect.vue
           │   ├── Home.vue
           │   ├── Leaderboard.vue
           │   ├── Login.vue
           │   ├── NotFound.vue
           │   ├── Profile.vue
           │   └── Register.vue
           ├── router/
           │   └── index.ts
           └── stores/
               ├── activity.ts
               ├── auth.ts
               └── user.ts
