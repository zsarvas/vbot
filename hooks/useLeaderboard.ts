import { useState, useEffect, useCallback } from 'react';
import { PlayerData } from '../types/PlayerTypes';

export type LeaderboardType = '1v1' | '2v2';

interface UseLeaderboardReturn {
  data: PlayerData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLeaderboard = (type: LeaderboardType = '2v2'): UseLeaderboardReturn => {
  const [data, setData] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/leaderboard/${type}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch leaderboard' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const leaderboardData = await response.json();
      setData(Array.isArray(leaderboardData) ? leaderboardData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error(`Error fetching ${type} leaderboard data:`, err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}; 