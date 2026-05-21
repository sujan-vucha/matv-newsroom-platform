import { useState, useEffect } from 'react';
import { useMoreToExplore, useTopStories } from '../store';

export function useMoreToExploreData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchMoreToExploreData } = useMoreToExplore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const response = await fetchMoreToExploreData();
      
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
    loadData();
  };

  return { data, loading, error, refetch };
}


export function useTopStoriesData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchTopStoriesData } = useTopStories();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const response = await fetchTopStoriesData();
      
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
    loadData();
  };

  return { data, loading, error, refetch };
}