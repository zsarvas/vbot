import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
      
      const { data: rocketleague, error } = await supabase
        .from('rocketleague')
        .select('*')
        .order('MMR', { ascending: false });

      if (error) throw error;
      
      setData(rocketleague || []);
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