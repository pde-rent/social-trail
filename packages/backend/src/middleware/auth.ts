import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { UserRole } from '@social-trail/common';

interface AuthRequest extends Request {
  user?: {
    id: string;
    roles: UserRole[];
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; roles: UserRole[] };
    
    req.user = {
      id: decoded.id,
      roles: decoded.roles
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    
    const hasRole = req.user.roles.some(role => roles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    
    next();
  };
}; 