import { jwtVerify, SignJWT } from 'jose';
import { JWTPayload } from '../types/AuthTypes';

// JWT secrets - convert to Uint8Array for jose
const JWT_ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || 'your-access-secret-key'
);

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
);

// Edge Runtime compatible JWT verification
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_ACCESS_SECRET);
    
    // Transform jose payload to our JWTPayload format
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      username: payload.username as string,
      role: payload.role as 'admin' | 'moderator' | 'user',
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    console.error('Error verifying token in edge runtime:', error);
    return null;
  }
}

// Edge Runtime compatible JWT generation (if needed)
export async function generateTokenEdge(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  try {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(JWT_ACCESS_SECRET);
    
    return jwt;
  } catch (error) {
    console.error('Error generating token in edge runtime:', error);
    throw new Error('Failed to generate token');
  }
}

// Utility to extract token from cookies (Edge Runtime compatible)
export function extractTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  return cookies.accessToken || null;
} 