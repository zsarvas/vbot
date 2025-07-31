import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAuthCookies } from '../../../lib/auth';
import { AuthResponse } from '../../../types/AuthTypes';

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
    // Clear authentication cookies
    clearAuthCookies(res);

    // In a real application, you might want to:
    // 1. Add the refresh token to a blacklist
    // 2. Log the logout event
    // 3. Clear any server-side sessions

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
} 