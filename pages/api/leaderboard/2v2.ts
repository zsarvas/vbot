import type { NextApiRequest, NextApiResponse } from 'next';
import { PlayerData } from '../../../types/PlayerTypes';

const API_BASE_URL = 'http://165.227.14.250';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlayerData[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.error('API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const response = await fetch(`${API_BASE_URL}/api/leaderboard/2v2`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey, // Adjust header name if your API expects a different one
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Leaderboard 2v2 API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Failed to fetch 2v2 leaderboard: ${response.statusText}` 
      });
    }

    const data = await response.json();
    
    // Ensure data is an array and sort by MMR descending
    const leaderboardData = Array.isArray(data) ? data : [];
    const sortedData = leaderboardData.sort((a: PlayerData, b: PlayerData) => 
      (b.MMR || 0) - (a.MMR || 0)
    );

    res.status(200).json(sortedData);

  } catch (error) {
    console.error('Error fetching 2v2 leaderboard:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch 2v2 leaderboard' 
    });
  }
}

