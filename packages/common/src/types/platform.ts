export enum SocialPlatform {
  X = 'X',
  YOUTUBE = 'YOUTUBE',
  TIKTOK = 'TIKTOK',
  INSTAGRAM = 'INSTAGRAM',
  DISCORD = 'DISCORD',
  GITHUB = 'GITHUB',
  TELEGRAM = 'TELEGRAM',
  EVM = 'EVM'
}

export interface OAuthToken {
  userId: string;
  platform: SocialPlatform;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  scope?: string;
} 