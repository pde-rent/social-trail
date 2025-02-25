import env from './env';

export const config = {
  jwtSecret: env.JWT_SECRET || 'your-secret-key',
  frontendUrl: env.FRONTEND_URL || 'http://localhost:3000',
  oauth: {
    github: {
      clientId: env.GITHUB_CLIENT_ID || '',
      clientSecret: env.GITHUB_CLIENT_SECRET || '',
      callbackUrl: `${env.API_URL || 'http://localhost:4000'}/api/auth/callback/github`
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID || '',
      clientSecret: env.DISCORD_CLIENT_SECRET || '',
      callbackUrl: `${env.API_URL || 'http://localhost:4000'}/api/auth/callback/discord`
    },
    x: {
      clientId: env.X_CLIENT_ID || '',
      clientSecret: env.X_CLIENT_SECRET || '',
      callbackUrl: `${env.API_URL || 'http://localhost:4000'}/api/auth/callback/x`
    }
  }
}; 