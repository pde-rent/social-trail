import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { SocialPlatform } from '@social-trail/common';
import { linkSocialAccount } from '../services/oauthService';
import config from '../config/env';

// Define the AuthRequest type to match what authenticate middleware expects
interface AuthRequest extends Request {
  user?: {
    id: string;
    roles: string[];
  };
}

const router = Router();

// Mock OAuth flow for demonstration purposes
router.get('/connect/:platform', authenticate, (req: AuthRequest, res: Response) => {
  const platform = req.params.platform as SocialPlatform;
  
  // In a real implementation, redirect to the OAuth provider's authorization URL
  const mockAuthUrl = `/oauth/mock-auth?platform=${platform}&userId=${req.user?.id}`;
  
  res.redirect(mockAuthUrl);
});

// Mock OAuth callback for demonstration purposes
router.get('/callback/:platform', async (req: Request, res: Response) => {
  try {
    const platform = req.params.platform as SocialPlatform;
    const { code, userId } = req.query;
    
    if (!code || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters'
      });
    }
    
    // In a real implementation, exchange the code for an access token
    // and get the user's profile from the OAuth provider
    
    // Mock data for demonstration
    const mockData = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresIn: 3600,
      handle: `user_${userId}_on_${platform}`
    };
    
    // Link social account
    await linkSocialAccount(
      userId as string,
      platform,
      mockData.handle,
      mockData.accessToken,
      mockData.refreshToken,
      mockData.expiresIn
    );
    
    // Redirect to frontend
    res.redirect(`/profile?platform=${platform}&connected=true`);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Mock OAuth authentication page for demonstration
router.get('/mock-auth', (req, res) => {
  const { platform, userId } = req.query;
  
  res.send(`
    <html>
      <head>
        <title>Mock OAuth for ${platform}</title>
      </head>
      <body>
        <h1>Mock OAuth for ${platform}</h1>
        <p>This is a mock OAuth page for demonstration purposes.</p>
        <form action="/oauth/callback/${platform}" method="get">
          <input type="hidden" name="code" value="mock_code" />
          <input type="hidden" name="userId" value="${userId}" />
          <button type="submit">Authorize</button>
        </form>
      </body>
    </html>
  `);
});

export default router; 