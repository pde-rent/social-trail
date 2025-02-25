import redisClient from '../db/redis';
import { SocialPlatform, OAuthToken } from '@contribution-tracker/common';
import { linkSocialHandle } from './userService';

export const storeOAuthToken = async (
  userId: string,
  platform: SocialPlatform,
  accessToken: string,
  refreshToken: string | undefined,
  expiresIn: number,
  scope?: string
): Promise<OAuthToken> => {
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  
  const token: OAuthToken = {
    userId,
    platform,
    accessToken,
    refreshToken,
    expiresAt,
    scope
  };
  
  // Convert token object to field-value pairs for Redis hSet
  const tokenEntries = Object.entries(token).filter(([_, value]) => value !== undefined);
  await redisClient.hSet(`user:${userId}:oauth:${platform}`, tokenEntries.flat());
  
  return token;
};

export const getOAuthToken = async (
  userId: string,
  platform: SocialPlatform
): Promise<OAuthToken | null> => {
  const token = await redisClient.hGetAll(`user:${userId}:oauth:${platform}`);
  
  if (!Object.keys(token).length) {
    return null;
  }
  
  return token as unknown as OAuthToken;
};

export const refreshOAuthToken = async (
  userId: string,
  platform: SocialPlatform,
  newAccessToken: string,
  newRefreshToken: string | undefined,
  expiresIn: number
): Promise<OAuthToken | null> => {
  const token = await getOAuthToken(userId, platform);
  
  if (!token) {
    return null;
  }
  
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  
  const updatedToken: OAuthToken = {
    ...token,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken || token.refreshToken,
    expiresAt
  };
  
  // Convert token object to field-value pairs for Redis hSet
  const tokenEntries = Object.entries(updatedToken).filter(([_, value]) => value !== undefined);
  await redisClient.hSet(`user:${userId}:oauth:${platform}`, tokenEntries.flat());
  
  return updatedToken;
};

export const linkSocialAccount = async (
  userId: string,
  platform: SocialPlatform,
  handle: string,
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
  scope?: string
): Promise<boolean> => {
  // Link social handle to user
  const linked = await linkSocialHandle(userId, platform, handle);
  
  if (!linked) {
    return false;
  }
  
  // Store OAuth token if provided
  if (accessToken && expiresIn) {
    await storeOAuthToken(
      userId,
      platform,
      accessToken,
      refreshToken,
      expiresIn,
      scope
    );
  }
  
  return true;
}; 