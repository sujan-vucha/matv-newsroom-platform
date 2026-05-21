import { useState, useEffect } from 'react';
import { useMoney } from '../store/moneyStore';

export function useMoneyData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchMoneyData } = useMoney();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      const response = await fetchMoneyData();
      
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

// Hook for getting stories by category
export function useMoneyByCategory(category) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchMoneyData, getStoriesByCategory } = useMoney();

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      await fetchMoneyData();
      const categoryStories = getStoriesByCategory(category);
      setStories(categoryStories);
      setLoading(false);
    }

    if (category) {
      loadStories();
    }
  }, [category]);

  return { stories, loading };
}

// Hook for searching stories by tags
export function useMoneyByTags(tag) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { fetchMoneyData, searchByTags } = useMoney();

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      await fetchMoneyData();
      const taggedStories = searchByTags(tag);
      setStories(taggedStories);
      setLoading(false);
    }

    if (tag) {
      loadStories();
    }
  }, [tag]);

  return { stories, loading };
}