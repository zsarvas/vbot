import { useState, useEffect } from 'react';
import { PlayerData } from '../types/PlayerTypes';

interface UseLeaderboardReturn {
  data: PlayerData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLeaderboard = (): UseLeaderboardReturn => {
  const [data, setData] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/leaderboard');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch leaderboard' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const leaderboardData = await response.json();
      setData(Array.isArray(leaderboardData) ? leaderboardData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}; 