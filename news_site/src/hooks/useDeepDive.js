import { useState, useEffect } from 'react';
import { useDeepDive } from '../store/deepDiveStore';

export function useDeepDiveData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchDeepDiveData } = useDeepDive();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const response = await fetchDeepDiveData();
      
      if (response.data && !response.error) {
        setData(response.data);
      } else {
        setError(response.error);
        setData(response.data);
      }
      
      setLoading(false);
    }

    loadData();
  }, []);

  const refetch = async () => {
    await loadData();
  };

  return { data, loading, error, refetch };
}