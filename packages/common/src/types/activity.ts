import { SocialPlatform } from './platform';

export enum ActivityType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  LIKE = 'LIKE',
  SHARE = 'SHARE',
  FOLLOW = 'FOLLOW',
  CONTRIBUTION = 'CONTRIBUTION',
  CODE_COMMIT = 'CODE_COMMIT'
}

export interface Activity {
  id: string;
  userId: string;
  platform: SocialPlatform;
  type: ActivityType;
  points: number;
  verified: boolean;
  timestamp: string;
  metadata: Record<string, any>;
} 