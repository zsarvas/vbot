import { User, UserRepository } from '../types/AuthTypes';
import bcrypt from 'bcryptjs';

// In-memory storage - easily replaceable with real database
class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> userId
  private usernameIndex: Map<string, string> = new Map(); // username -> userId

  constructor() {
    // Initialize with some demo users
    this.seedUsers();
  }

  private async seedUsers() {
    const demoUsers = [
      {
        id: '1',
        email: 'admin@example.com',
        username: 'admin',
        name: 'Admin User',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'user@example.com',
        username: 'user',
        name: 'Regular User',
        password: await bcrypt.hash('user123', 10),
        role: 'user' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        email: '2cds@example.com',
        username: '2CDs',
        name: '2CDs',
        password: await bcrypt.hash('password123', 10),
        role: 'user' as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    for (const userData of demoUsers) {
      const user = userData as User;
      this.users.set(user.id, user);
      this.emailIndex.set(user.email.toLowerCase(), user.id);
      this.usernameIndex.set(user.username.toLowerCase(), user.id);
    }
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email.toLowerCase());
    return userId ? this.users.get(userId) || null : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userId = this.usernameIndex.get(username.toLowerCase());
    return userId ? this.users.get(userId) || null : null;
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = this.generateId();
    const now = new Date();
    
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, user);
    this.emailIndex.set(user.email.toLowerCase(), id);
    this.usernameIndex.set(user.username.toLowerCase(), id);

    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const existingUser = this.users.get(id);
    if (!existingUser) return null;

    // Handle email/username changes in indexes
    if (userData.email && userData.email !== existingUser.email) {
      this.emailIndex.delete(existingUser.email.toLowerCase());
      this.emailIndex.set(userData.email.toLowerCase(), id);
    }
    
    if (userData.username && userData.username !== existingUser.username) {
      this.usernameIndex.delete(existingUser.username.toLowerCase());
      this.usernameIndex.set(userData.username.toLowerCase(), id);
    }

    const updatedUser: User = {
      ...existingUser,
      ...userData,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;

    this.users.delete(id);
    this.emailIndex.delete(user.email.toLowerCase());
    this.usernameIndex.delete(user.username.toLowerCase());

    return true;
  }

  async updateLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLoginAt = new Date();
      user.updatedAt = new Date();
      this.users.set(id, user);
    }
  }

  // Helper method to get all users (for admin purposes)
  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Utility method for checking if email/username exists
  async emailExists(email: string): Promise<boolean> {
    return this.emailIndex.has(email.toLowerCase());
  }

  async usernameExists(username: string): Promise<boolean> {
    return this.usernameIndex.has(username.toLowerCase());
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

// Singleton pattern - easily replaceable with database connection
export const userRepository = new InMemoryUserRepository();

// Factory function for easy database migration
export function createUserRepository(): UserRepository {
  // In the future, this could return a PostgreSQL, MongoDB, etc. implementation
  return userRepository;
} 