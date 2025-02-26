import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { 
  recordActivity, 
  getUserActivities, 
  verifyActivity 
} from '../services/activityService';
import { ActivityType, SocialPlatform, UserRole } from '@social-trail/common';

const router = Router();

// Record user activity
router.post('/record', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { platform, type, metadata } = req.body;
    
    if (!platform || !type) {
      return res.status(400).json({
        success: false,
        error: 'Platform and activity type are required'
      });
    }
    
    const activity = await recordActivity(
      userId,
      platform as SocialPlatform,
      type as ActivityType,
      metadata || {}
    );
    
    return res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get user activity history
router.get('/user/:userId?', authenticate, async (req, res) => {
  try {
    const userId = req.params.userId || req.user!.id;
    
    // If requesting another user's activities, check if admin
    if (userId !== req.user!.id && !req.user!.roles.includes(UserRole.ADMIN)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden'
      });
    }
    
    const limit = parseInt(req.query.limit as string || '20', 10);
    const offset = parseInt(req.query.offset as string || '0', 10);
    
    const activities = await getUserActivities(userId, limit, offset);
    
    return res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Verify activity (admin only)
router.post('/verify/:activityId', authenticate, authorize([UserRole.ADMIN]), async (req, res) => {
  try {
    const { activityId } = req.params;
    
    const activity = await verifyActivity(activityId);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Activity not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 