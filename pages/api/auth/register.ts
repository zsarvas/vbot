import type { NextApiRequest, NextApiResponse } from 'next';
import { authService, setAuthCookies } from '../../../lib/auth';
import { AuthResponse, RegisterCredentials } from '../../../types/AuthTypes';

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
    const credentials: RegisterCredentials = req.body;

    // Validation
    if (!credentials.email || !credentials.username || !credentials.name || !credentials.password || !credentials.confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    if (!authService.isValidEmail(credentials.email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (!authService.isValidUsername(credentials.username)) {
      return res.status(400).json({
        success: false,
        error: 'Username must be 3-20 characters and contain only letters, numbers, hyphens, and underscores'
      });
    }

    if (credentials.password !== credentials.confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match'
      });
    }

    if (credentials.password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Create user
    const user = await authService.createUser(credentials);

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

    res.status(201).json({
      success: true,
      user: authUser,
      tokens, // Include tokens in response for client-side storage if needed
      message: 'Registration successful'
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle specific errors
    if (error.message === 'Email already exists' || error.message === 'Username already exists') {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 