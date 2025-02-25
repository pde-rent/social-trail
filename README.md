<div align="center">
  <img src="packages/frontend/public/logo.svg" alt="SocialTrail Logo" width="200" style="filter: hue-rotate(240deg);" />
  <h1>SocialTrail</h1>
  <p>Track social engagement and contributions across multiple platforms</p>
</div>

## 📋 Overview

SocialTrail is an application designed to track users' social activity across multiple platforms, allowing them to earn reputation points when engaging with content on X (Twitter), YouTube, TikTok, Instagram, and other platforms.

The application follows a monorepo structure with shared code between frontend and backend components, making it easier to maintain type consistency and shared utilities.

## 🏗️ Architecture

### Tech Stack

- **Backend**: Bun.js with Express and Redis for caching and persistence
- **Frontend**: Vue.js with Pug templating and Tailwind CSS
- **Common**: Shared TypeScript code (types, utilities)

### Repository Structure

```
./
├── package.json
└── packages/
   ├── common/         # Shared types and utilities
   ├── backend/        # Bun.js + Express API server
   └── frontend/       # Vue.js frontend application
```

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- [Redis](https://redis.io/) (v6.0.0 or higher)
- Node.js (v18 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pde-rent/social-trail.git
   cd socialtrail
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Server
   PORT=5173
   FRONTEND_URL=http://localhost:5174
   JWT_SECRET=your-secret-key

   # Redis
   REDIS_URL=redis://localhost:6379

   # OAuth Credentials
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=http://localhost:5173/auth/callback/github

   DISCORD_CLIENT_ID=your-discord-client-id
   DISCORD_CLIENT_SECRET=your-discord-client-secret
   DISCORD_CALLBACK_URL=http://localhost:5173/auth/callback/discord

   X_CLIENT_ID=your-twitter-client-id
   X_CLIENT_SECRET=your-twitter-client-secret
   X_CALLBACK_URL=http://localhost:5173/auth/callback/twitter
   ```

4. Start the development servers:
   ```bash
   # Start backend
   cd packages/backend
   bun run dev

   # Start frontend (in a new terminal)
   cd packages/frontend
   bun run dev
   ```

## 🔑 Features

### Authentication

- Email/password authentication
- OAuth integration with multiple platforms:
  - X (Twitter)
  - Discord
  - GitHub
  - Telegram
  - TikTok
  - Instagram
  - YouTube
  - EVM (Ethereum, etc.)

### User Management

- User profiles with social handles
- Role-based access control
- Reputation points system

### Activity Tracking

- Record user activity across platforms
- Leaderboard of top contributors
- Activity feed showing recent contributions

## 👥 User Roles

Each user can have one or more of the following roles:

- **Admin**: Full system access
- **Artist**: Content creation
- **Copywriter**: Text content
- **Coder**: Technical contributions
- **Economist**: Financial analysis
- **Default**: Basic contributor role

## 🔌 API Endpoints

### Authentication

- `POST /auth/login`: Authenticate user
- `POST /auth/register`: Register a new user
- `POST /auth/logout`: End user session
- `POST /auth/verify`: Verify user token

### OAuth Integration

- `GET /auth/github`: Initiate GitHub OAuth flow
- `GET /auth/discord`: Initiate Discord OAuth flow
- `GET /auth/twitter`: Initiate Twitter/X OAuth flow
- `GET /auth/callback/:platform`: Handle OAuth callbacks

### User Management

- `GET /users/:handle/exists`: Check if a user exists by social handle
- `GET /users/:handle/reputation`: Get user reputation points by social handle
- `GET /users/:userId/social-handles`: Get all social handles for a user (admin only)
- `POST /users/verify-signature`: Validate a user signature against any social handle

### Activity Tracking

- `POST /activity/record`: Record user activity
- `GET /activity/user/:userId`: Get user activity history
- `GET /leaderboard`: Get reputation leaderboard

## 🔧 Development

### Frontend Conventions

- **Template Engine**: Pug for Vue templates with `lang="pug"` attribute
- **Styling**: Tailwind CSS with underscore notation (e.g., `md_flex` instead of `md:flex`)
- **State Management**: Pinia for state management

### Backend Architecture

- **Database**: Redis as the sole database
- **Server**: Express.js framework
- **Runtime**: Bun

## 🔒 Security Considerations

- Secure storage of OAuth tokens
- Rate limiting on API endpoints
- Input validation
- Role-based access control
- Signature verification for sensitive operations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
