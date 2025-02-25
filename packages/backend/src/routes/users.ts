import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { 
  getUserById, 
  getUserProfile, 
  getUserBySocialHandle, 
  getUserReputationByHandle,
  getLeaderboard,
  updateUser
} from '../services/userService';
import { SocialPlatform, UserRole } from '@contribution-tracker/common';

const router = Router();

// Check if a user exists by social handle
router.get('/:handle/exists', async (req, res) => {
  try {
    const { handle } = req.params;
    const { platform } = req.query;
    
    if (!platform) {
      return res.status(400).json({
        success: false,
        error: 'Platform is required'
      });
    }
    
    const user = await getUserBySocialHandle(platform as SocialPlatform, handle);
    
    return res.status(200).json({
      success: true,
      data: {
        exists: !!user
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user reputation by social handle
router.get('/:handle/reputation', async (req, res) => {
  try {
    const { handle } = req.params;
    const { platform } = req.query;
    
    if (!platform) {
      return res.status(400).json({
        success: false,
        error: 'Platform is required'
      });
    }
    
    const reputation = await getUserReputationByHandle(platform as SocialPlatform, handle);
    
    return res.status(200).json({
      success: true,
      data: {
        reputation
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const profile = await getUserProfile(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { username, bio } = req.body;
    
    const updates: any = {};
    
    if (username) {
      updates.username = username;
    }
    
    const updatedUser = await updateUser(userId, updates);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Update bio if provided
    if (bio) {
      await redisClient.set(`user:${userId}:bio`, bio);
    }
    
    const profile = await getUserProfile(userId);
    
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all social handles for a user (admin only)
router.get('/:userId/social-handles', authenticate, authorize([UserRole.ADMIN]), async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await getUserProfile(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: profile.socialHandles
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string || '10', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);
    
    const users = await getLeaderboard(limit, offset);
    
    return res.status(200).json({
      success: true,
      data: users.map(user => ({
        id: user.id,
        username: user.username,
        reputation: user.reputation,
        roles: user.roles
      }))
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 