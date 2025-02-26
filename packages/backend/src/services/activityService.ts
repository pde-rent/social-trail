import { v4 as uuidv4 } from 'uuid';
import redisClient from '../db/redis';
import { type Activity, ActivityType, SocialPlatform, calculatePoints } from '@social-trail/common';
import { getUserById, updateUser } from './userService';

export const recordActivity = async (
  userId: string,
  platform: SocialPlatform,
  type: ActivityType,
  metadata: Record<string, any> = {}
): Promise<Activity> => {
  const activityId = uuidv4();
  const timestamp = new Date().toISOString();
  const points = calculatePoints(type);
  
  const activity: Activity = {
    id: activityId,
    userId,
    platform,
    type,
    points,
    metadata,
    timestamp,
    verified: false
  };
  
  // Store activity in Redis
  await redisClient.hSet(
    `activity:${activityId}`,
    Object.entries(activity).reduce((obj, [key, value]) => {
      obj[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return obj;
    }, {} as Record<string, string>)
  );
  await redisClient.zAdd(`user:${userId}:activities`, {
    score: new Date(timestamp).getTime(),
    value: activityId
  });
  
  // Update user reputation
  const user = await getUserById(userId);
  if (user) {
    await updateUser(userId, {
      reputation: user.reputation + points
    });
  }
  
  return activity;
};

export const verifyActivity = async (activityId: string): Promise<Activity | null> => {
  const activity = await getActivityById(activityId);
  
  if (!activity) {
    return null;
  }
  
  const updatedActivity = {
    ...activity,
    verified: true
  };
  
  // Convert complex types to strings for Redis
  await redisClient.hSet(`activity:${activityId}`, Object.entries(updatedActivity).reduce((obj, [key, value]) => {
    obj[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return obj;
  }, {} as Record<string, string>));
  
  return updatedActivity;
};

export const getActivityById = async (activityId: string): Promise<Activity | null> => {
  const activity = await redisClient.hGetAll(`activity:${activityId}`);
  
  if (!Object.keys(activity).length) {
    return null;
  }
  
  return {
    ...activity,
    points: parseInt(activity.points as string, 10),
    verified: activity.verified === 'true',
    metadata: JSON.parse(activity.metadata as string)
  } as Activity;
};

export const getUserActivities = async (
  userId: string,
  limit = 20,
  offset = 0
): Promise<Activity[]> => {
  const activityIds = await redisClient.zRange(`user:${userId}:activities`, offset, offset + limit - 1, {
    REV: true
  });
  
  if (!activityIds.length) {
    return [];
  }
  
  const activities = await Promise.all(activityIds.map(id => getActivityById(id)));
  
  return activities.filter(activity => activity !== null) as Activity[];
}; 