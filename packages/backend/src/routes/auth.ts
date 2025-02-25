import { Router, Request, Response, NextFunction } from 'express';
import { loginUser, registerUser, verifyToken } from '../services/authService';
import { authenticate } from '../middleware/auth';
import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as DiscordStrategy } from 'passport-discord';
import TwitterStrategy from 'passport-twitter-oauth2.0';
import jwt from 'jsonwebtoken';
import { userService } from '../services/userService';
import { config } from '../config';
import session from 'express-session';
import { User, UserRole } from '@contribution-tracker/common';

const router = Router();

console.log('Auth routes loaded');

// Add this at the top of your file for better error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Add session middleware for OAuth state management
router.use(session({
  secret: config.jwtSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Define the AuthRequest type
interface AuthRequest extends Request {
  user?: {
    id: string;
    roles: UserRole[];
  };
}

// Configure Passport strategies
passport.use(new GitHubStrategy({
  clientID: config.oauth.github.clientId,
  clientSecret: config.oauth.github.clientSecret,
  callbackURL: config.oauth.github.callbackUrl
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // Find or create user based on OAuth profile
    const user = await userService.findOrCreateOAuthUser({
      provider: 'github',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      displayName: profile.displayName || profile.username,
      photoUrl: profile.photos?.[0]?.value
    });
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use(new DiscordStrategy({
  clientID: config.oauth.discord.clientId,
  clientSecret: config.oauth.discord.clientSecret,
  callbackURL: config.oauth.discord.callbackUrl,
  scope: ['identify', 'email']
}, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    // Find or create user based on OAuth profile
    const user = await userService.findOrCreateOAuthUser({
      provider: 'discord',
      providerId: profile.id,
      email: profile.email,
      displayName: profile.username,
      photoUrl: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : undefined
    });
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Add this before configuring the Twitter strategy
console.log('Twitter OAuth config:', {
  clientId: config.oauth.twitter.clientId ? 'Set' : 'Not set',
  clientSecret: config.oauth.twitter.clientSecret ? 'Set' : 'Not set',
  callbackUrl: config.oauth.twitter.callbackUrl
});

// Check if Twitter credentials are available
if (config.oauth.twitter.clientId && config.oauth.twitter.clientSecret) {
  console.log('Configuring Twitter OAuth 2.0 strategy');
  
  passport.use(new TwitterStrategy({
    clientID: config.oauth.twitter.clientId,
    clientSecret: config.oauth.twitter.clientSecret,
    callbackURL: config.oauth.twitter.callbackUrl,
    clientType: 'confidential',
    pkce: true,
    state: true,
    scope: ['tweet.read', 'users.read', 'offline.access']
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      console.log('Twitter OAuth 2.0 profile:', profile);
      
      // Find or create user based on OAuth profile
      const user = await userService.findOrCreateOAuthUser({
        provider: 'twitter',
        providerId: profile.id,
        email: profile.emails?.[0]?.value,
        displayName: profile.displayName || profile.username || profile.name,
        photoUrl: profile.photos?.[0]?.value || profile.profile_image_url
      });
      
      return done(null, user);
    } catch (error) {
      console.error('Error in Twitter OAuth callback:', error);
      return done(error);
    }
  }));
} else {
  console.warn('Twitter OAuth credentials not found. Twitter authentication will not be available.');
}

// Initialize Passport
router.use(passport.initialize());

// Log all OAuth configurations
console.log('OAuth Configurations:');
Object.entries(config.oauth).forEach(([provider, providerConfig]) => {
  console.log(`${provider} OAuth config:`, {
    clientId: (providerConfig as any).clientId ? 'Set' : 'Not set',
    clientSecret: (providerConfig as any).clientSecret ? 'Set' : 'Not set',
    callbackUrl: (providerConfig as any).callbackUrl
  });
});

// GitHub OAuth routes
router.get('/github', (req, res, next) => {
  console.log('GitHub auth route hit');
  passport.authenticate('github', {
    scope: ['user:email']
  })(req, res, next);
});

router.get('/callback/github', (req: Request, res: Response, next: NextFunction) => {
  console.log('GitHub callback route hit');
  console.log('Query params:', req.query);
  
  passport.authenticate('github', { session: false }, (err: Error | null, user: any, info: any) => {
    if (err) {
      console.error('GitHub authentication error:', err);
      return res.redirect(`${config.frontendUrl}/auth?error=${encodeURIComponent(err.message || 'Authentication failed')}`);
    }
    
    if (!user) {
      console.error('GitHub authentication failed - no user:', info);
      return res.redirect(`${config.frontendUrl}/auth?error=${encodeURIComponent('Authentication failed - no user returned')}`);
    }
    
    console.log('User authenticated:', user);
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });
    
    // Send token to frontend
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { token: "${token}", user: ${JSON.stringify(user)} }, 
              "${config.frontendUrl}"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  })(req, res, next);
});

// Discord OAuth routes
router.get('/discord', passport.authenticate('discord'));

router.get('/callback/discord', (req: Request, res: Response, next: NextFunction) => {
  console.log('Discord callback route hit');
  passport.authenticate('discord', { session: false }, (err: Error | null, user: any) => {
    if (err || !user) {
      return res.redirect(`${config.frontendUrl}/auth?error=${encodeURIComponent(err?.message || 'Authentication failed')}`);
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });
    
    // Send token to frontend via postMessage
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage(
              { token: "${token}", user: ${JSON.stringify(user)} }, 
              "${config.frontendUrl}"
            );
            window.close();
          </script>
        </body>
      </html>
    `);
  })(req, res, next);
});

// Update Twitter/X OAuth routes to use OAuth 2.0
router.get('/twitter', (req, res, next) => {
  if (!config.oauth.twitter.clientId) {
    return res.status(501).json({
      success: false,
      error: 'Twitter authentication is not configured'
    });
  }
  
  passport.authenticate('twitter')(req, res, next);
});

router.get('/callback/twitter', (req: Request, res: Response, next: NextFunction) => {
  console.log('Twitter callback route hit');
  
  if (!config.oauth.twitter.clientId) {
    return res.redirect(`${config.frontendUrl}/auth?error=${encodeURIComponent('Twitter authentication is not configured')}`);
  }
  
  passport.authenticate('twitter', { session: false }, (err: Error | null, user: any, info: any) => {
    if (err) {
      console.error('Twitter authentication error:', err);
      return res.redirect(`${config.frontendUrl}/auth?error=${encodeURIComponent(err.message || 'Authentication failed')}`);
    }
    
    if (!user) {
      console.error('Twitter authentication failed - no user:', info);
      return res.redirect(`${config.frontendUrl}/auth?error=${encodeURIComponent('Authentication failed - no user returned')}`);
    }
    
    try {
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });
      
      console.log('Twitter authentication successful for user:', user.id);
      
      // Send token to frontend via postMessage
      res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage(
                { token: "${token}", user: ${JSON.stringify(user)} }, 
                "${config.frontendUrl}"
              );
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (tokenError) {
      console.error('Error generating token:', tokenError);
      return res.redirect(`${config.frontendUrl}/auth?error=${encodeURIComponent('Error generating authentication token')}`);
    }
  })(req, res, next);
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and username are required'
      });
    }
    
    const user = await registerUser(email, password, username);
    
    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const { user, token } = await loginUser(email, password);
    
    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          roles: user.roles,
          reputation: user.reputation
        }
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/verify', authenticate, (req: AuthRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
});

router.post('/logout', authenticate, (req: AuthRequest, res: Response) => {
  // Client-side logout (just return success)
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router; 