import { ActivityType } from '../types/activity';

// Points awarded for different activity types
const ACTIVITY_POINTS: Record<ActivityType, number> = {
  [ActivityType.POST]: 5,
  [ActivityType.COMMENT]: 2,
  [ActivityType.LIKE]: 1,
  [ActivityType.SHARE]: 3,
  [ActivityType.FOLLOW]: 2,
  [ActivityType.CONTRIBUTION]: 10,
  [ActivityType.CODE_COMMIT]: 8
};

export const calculatePoints = (activityType: ActivityType, multiplier = 1): number => {
  return ACTIVITY_POINTS[activityType] * multiplier;
}; 