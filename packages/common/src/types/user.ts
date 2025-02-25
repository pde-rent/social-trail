import { SocialPlatform } from './platform';

export enum UserRole {
  DEFAULT = 'DEFAULT',
  ADMIN = 'ADMIN',
  ARTIST = 'ARTIST',
  COPYWRITER = 'COPYWRITER',
  CODER = 'CODER',
  ECONOMIST = 'ECONOMIST'
}

export interface User {
  id: string;
  username: string;
  email: string;
  photoUrl?: string;
  roles: UserRole[];
  socialHandles?: Record<SocialPlatform, string>;
  reputation: number;
  createdAt: string;
  updatedAt: string;
  oauthProviders?: Array<{
    provider: string;
    providerId: string;
  }>;
}

export interface UserProfile extends User {
  bio?: string;
  avatarUrl?: string;
} 