import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import redisClient from '../db/redis';
import config from '../config/env';
import { User, UserRole } from '@contribution-tracker/common';
import { getUserByEmail, createUser } from './userService';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const registerUser = async (
  email: string,
  password: string,
  username: string
): Promise<User> => {
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  // Create user
  const user = await createUser({
    email,
    username,
    roles: [UserRole.DEFAULT]
  });
  
  // Store password hash
  await redisClient.set(`user:${user.id}:password`, hashedPassword);
  
  // Create email index
  await redisClient.set(`email:${email}`, user.id);
  
  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Get user by email
  const user = await getUserByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Get password hash
  const passwordHash = await redisClient.get(`user:${user.id}:password`);
  
  if (!passwordHash) {
    throw new Error('Invalid credentials');
  }
  
  // Compare password
  const isPasswordValid = await comparePassword(password, passwordHash);
  
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, roles: user.roles },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
  
  return { user, token };
};

export const verifyToken = (token: string): { id: string; roles: UserRole[] } => {
  try {
    return jwt.verify(token, config.jwtSecret) as { id: string; roles: UserRole[] };
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 