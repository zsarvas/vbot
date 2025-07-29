export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export type UserRole = 'admin' | 'moderator' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  tokens?: AuthTokens;
  message?: string;
  error?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

// Database-like interfaces for easy migration
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  updateLastLogin(id: string): Promise<void>;
}

export interface AuthService {
  validateCredentials(email: string, password: string): Promise<User | null>;
  createUser(credentials: RegisterCredentials): Promise<User>;
  generateTokens(user: User): AuthTokens;
  verifyToken(token: string): JWTPayload | null;
  refreshTokens(refreshToken: string): Promise<AuthTokens | null>;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Protected route configuration
export interface ProtectedRouteConfig {
  path: string;
  requiredRole?: UserRole;
  redirectTo?: string;
} 