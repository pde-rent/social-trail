import { v4 as uuidv4 } from 'uuid';
import redisClient from '../db/redis';
import { User, UserProfile, UserRole, SocialPlatform } from '@contribution-tracker/common';
import bcrypt from 'bcrypt';

interface OAuthUserData {
  provider: string;
  providerId: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
}

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const userId = uuidv4();
  const now = new Date().toISOString();
  
  const user: User = {
    id: userId,
    username: userData.username || '',
    email: userData.email || '',
    roles: userData.roles || [UserRole.DEFAULT],
    socialHandles: userData.socialHandles || {} as Record<SocialPlatform, string>,
    reputation: 0,
    createdAt: now,
    updatedAt: now
  };
  
  await redisClient.hSet(`user:${userId}`, Object.entries(user).reduce((obj, [key, value]) => {
    obj[key] = typeof value === 'object' ? JSON.stringify(value) : value;
    return obj;
  }, {} as Record<string, string>));
  
  return user;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userJson = await redisClient.get(`user:${userId}`);
    if (!userJson) return null;
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const userId = await redisClient.get(`email:${email}`);
  
  if (!userId) {
    return null;
  }
  
  return getUserById(userId);
};

export const getUserBySocialHandle = async (platform: SocialPlatform, handle: string): Promise<User | null> => {
  const userId = await redisClient.get(`${platform}:${handle}`);
  
  if (!userId) {
    return null;
  }
  
  return getUserById(userId);
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  const user = await getUserById(userId);
  
  if (!user) {
    return null;
  }
  
  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await redisClient.hSet(`user:${userId}`, Object.entries(updatedUser).reduce((obj, [key, value]) => {
    obj[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
    return obj;
  }, {} as Record<string, string>));
  
  return updatedUser;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const user = await getUserById(userId);
  
  if (!user) {
    return null;
  }
  
  const socialHandles = await redisClient.hGetAll(`user:${userId}:social`);
  
  return {
    ...user,
    socialHandles: socialHandles as Record<SocialPlatform, string>,
    bio: await redisClient.get(`user:${userId}:bio`) || undefined,
    avatarUrl: await redisClient.get(`user:${userId}:avatar`) || undefined
  };
};

export const linkSocialHandle = async (
  userId: string, 
  platform: SocialPlatform, 
  handle: string
): Promise<boolean> => {
  // Check if handle is already linked to another user
  const existingUserId = await redisClient.get(`${platform}:${handle}`);
  
  if (existingUserId && existingUserId !== userId) {
    return false;
  }
  
  // Link handle to user
  await redisClient.set(`${platform}:${handle}`, userId);
  await redisClient.hSet(`user:${userId}:social`, platform, handle);
  
  return true;
};

export const getUserReputationByHandle = async (platform: SocialPlatform, handle: string): Promise<number> => {
  const userId = await redisClient.get(`${platform}:${handle}`);
  
  if (!userId) {
    return 0;
  }
  
  const user = await getUserById(userId);
  return user?.reputation || 0;
};

export const getLeaderboard = async (limit = 10, offset = 0): Promise<User[]> => {
  // Get all user IDs
  const userKeys = await redisClient.keys('user:*');
  const userIds = userKeys
    .filter(key => !key.includes(':social') && !key.includes(':bio') && !key.includes(':avatar'))
    .map(key => key.replace('user:', ''));
  
  // Get all users
  const users = await Promise.all(userIds.map(id => getUserById(id)));
  
  // Sort by reputation
  const sortedUsers = (users
    .filter(user => user !== null) as User[])
    .sort((a, b) => b.reputation - a.reputation);
  
  // Return paginated results
  return sortedUsers.slice(offset, offset + limit);
};

class UserService {
  // Find or create a user from OAuth data
  async findOrCreateOAuthUser(oauthData: OAuthUserData): Promise<User> {
    try {
      // First, try to find user by provider and providerId
      const userIdByProvider = await redisClient.get(`oauth:${oauthData.provider}:${oauthData.providerId}`);
      
      if (userIdByProvider) {
        // User exists, get their data
        const user = await this.getUserById(userIdByProvider);
        if (user) return user;
      }
      
      // If we have an email, try to find by email
      if (oauthData.email) {
        const userIdByEmail = await redisClient.get(`email:${oauthData.email}`);
        if (userIdByEmail) {
          // User exists with this email, link the OAuth provider
          await redisClient.set(`oauth:${oauthData.provider}:${oauthData.providerId}`, userIdByEmail);
          
          const user = await this.getUserById(userIdByEmail);
          if (user) {
            // Update user with OAuth provider info
            user.oauthProviders = user.oauthProviders || {};
            user.oauthProviders[oauthData.provider] = oauthData.providerId;
            
            await redisClient.set(`user:${userIdByEmail}`, JSON.stringify(user));
            return user;
          }
        }
      }
      
      // Create new user
      const userId = uuidv4();
      const username = oauthData.displayName || `user_${userId.substring(0, 8)}`;
      
      const newUser: User = {
        id: userId,
        username,
        email: oauthData.email || `${userId}@example.com`,
        roles: [UserRole.User],
        reputation: 0,
        createdAt: new Date().toISOString(),
        oauthProviders: {
          [oauthData.provider]: oauthData.providerId
        },
        photoUrl: oauthData.photoUrl
      };
      
      // Save user
      await redisClient.set(`user:${userId}`, JSON.stringify(newUser));
      await redisClient.set(`oauth:${oauthData.provider}:${oauthData.providerId}`, userId);
      
      if (oauthData.email) {
        await redisClient.set(`email:${oauthData.email}`, userId);
      }
      
      return newUser;
    } catch (error) {
      console.error('Error in findOrCreateOAuthUser:', error);
      throw error;
    }
  }

  // Additional methods as needed...
}

export const userService = new UserService(); 