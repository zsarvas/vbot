import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthService, User, RegisterCredentials, AuthTokens, JWTPayload } from '../types/AuthTypes';
import { createUserRepository } from './database';

// JWT secrets - in production these should be environment variables
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_ACCESS_EXPIRY = '15m'; // 15 minutes
const JWT_REFRESH_EXPIRY = '7d'; // 7 days

// Note: This service uses jsonwebtoken which is NOT compatible with Edge Runtime
// For Edge Runtime (middleware), use auth-edge.ts which uses the jose library

class AuthServiceImpl implements AuthService {
  private userRepo = createUserRepository();

  async validateCredentials(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepo.findByEmail(email);
      
      if (!user || !user.isActive) {
        return null;
      }

      // Check password - in the database, password field exists but not in User type for security
      const userWithPassword = user as User & { password: string };
      const isValidPassword = await bcrypt.compare(password, userWithPassword.password);
      
      if (!isValidPassword) {
        return null;
      }

      // Update last login
      await this.userRepo.updateLastLogin(user.id);
      
      return user;
    } catch (error) {
      console.error('Error validating credentials:', error);
      return null;
    }
  }

  async createUser(credentials: RegisterCredentials): Promise<User> {
    try {
      // Validate input
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if email or username already exists
      const emailExists = await this.userRepo.findByEmail(credentials.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }

      const usernameExists = await this.userRepo.findByUsername(credentials.username);
      if (usernameExists) {
        throw new Error('Username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(credentials.password, 12);

      // Create user
      const userData = {
        email: credentials.email.toLowerCase().trim(),
        username: credentials.username.trim(),
        name: credentials.name.trim(),
        password: hashedPassword,
        role: 'user' as const,
        isActive: true,
      };

      return await this.userRepo.create(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  generateTokens(user: User): AuthTokens {
    try {
      const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };

      const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: JWT_ACCESS_EXPIRY,
      });

      const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRY,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error generating tokens:', error);
      throw new Error('Failed to generate authentication tokens');
    }
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens | null> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      
      // In a real application, you'd validate the refresh token against a stored list
      // For now, we'll just generate new tokens if the refresh token is valid
      return await this.generateTokensById(decoded.userId);
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return null;
    }
  }

  private async generateTokensById(userId: string): Promise<AuthTokens | null> {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user || !user.isActive) {
        return null;
      }
      return this.generateTokens(user);
    } catch (error) {
      console.error('Error generating tokens by ID:', error);
      return null;
    }
  }

  // Utility methods
  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const payload = this.verifyToken(token);
      if (!payload) return null;

      const user = await this.userRepo.findById(payload.userId);
      return user && user.isActive ? user : null;
    } catch (error) {
      console.error('Error getting user from token:', error);
      return null;
    }
  }

  // Password utilities
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.userRepo.findById(userId);
      if (!user) return false;

      const userWithPassword = user as User & { password: string };
      const isValidCurrentPassword = await bcrypt.compare(currentPassword, userWithPassword.password);
      
      if (!isValidCurrentPassword) {
        return false;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await this.userRepo.update(userId, { password: hashedNewPassword } as any);
      
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  }

  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Username validation
  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  }
}

// Export singleton instance
export const authService = new AuthServiceImpl();

// Utility functions for Next.js API routes
export function extractTokenFromRequest(req: any): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function setAuthCookies(res: any, tokens: AuthTokens): void {
  // Set HTTP-only cookies for security
  res.setHeader('Set-Cookie', [
    `accessToken=${tokens.accessToken}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=Strict`,
    `refreshToken=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`
  ]);
}

export function clearAuthCookies(res: any): void {
  res.setHeader('Set-Cookie', [
    'accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict',
    'refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
  ]);
} 