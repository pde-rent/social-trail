export const config = {
  port: process.env.PORT || 5173,
  apiUrl: process.env.API_URL || 'http://localhost:5173',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5174',
  jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret',
  oauth: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5173/auth/callback/github'
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackUrl: process.env.DISCORD_CALLBACK_URL || 'http://localhost:5173/auth/callback/discord'
    },
    twitter: {
      clientId: process.env.X_CLIENT_ID || process.env.X_CLIENT_ID,
      clientSecret: process.env.X_CLIENT_SECRET || process.env.X_CLIENT_SECRET,
      callbackUrl: process.env.X_CALLBACK_URL || process.env.X_CALLBACK_URL || 'http://localhost:5173/auth/callback/twitter'
    }
  }
}; 