import type { NextApiRequest, NextApiResponse } from 'next';
import { authService, extractTokenFromRequest } from '../../../lib/auth';
import { AuthResponse } from '../../../types/AuthTypes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Try to get token from Authorization header
    let token = extractTokenFromRequest(req);
    
    // If no token in header, try to get from cookies
    if (!token && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    // Get user from token
    const user = await authService.getUserFromToken(token);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Return user data (without sensitive information)
    const authUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      user: authUser,
      message: 'User authenticated'
    });

  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 