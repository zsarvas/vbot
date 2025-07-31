import type { NextApiRequest, NextApiResponse } from 'next';
import { authService, setAuthCookies } from '../../../lib/auth';
import { AuthResponse, LoginCredentials } from '../../../types/AuthTypes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { email, password }: LoginCredentials = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    if (!authService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Authenticate user
    const user = await authService.validateCredentials(email, password);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate tokens
    const tokens = authService.generateTokens(user);
    
    // Set HTTP-only cookies
    setAuthCookies(res, tokens);

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
      tokens, // Include tokens in response for client-side storage if needed
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 